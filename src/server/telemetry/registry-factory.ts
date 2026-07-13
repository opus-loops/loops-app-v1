import { shutdownAzureMonitor } from "@azure/monitor-opentelemetry"
import {
  context as otelContext,
  metrics as otelMetrics,
  propagation,
  SpanStatusCode,
  trace,
} from "@opentelemetry/api"
import { isRedirect } from "@tanstack/react-router"
import { Cause, Effect } from "effect"
import { AsyncLocalStorage } from "node:async_hooks"

import type { TelemetryConfig } from "./config"
import type {
  TelemetryLogLevel,
  TelemetryRegistry,
  TelemetryRequestContext,
} from "./types"

import { installAxiosHooks } from "./axios-hooks"
import { statusClass, toError } from "./http-status"
import { redactAttributes, redactErrorMessage } from "./redact"
import { collectTelemetryPrimitives } from "./schema"

const LOG_LEVEL_ORDER: Record<TelemetryLogLevel, number> = {
  debug: 20,
  error: 50,
  fatal: 60,
  info: 30,
  trace: 10,
  warn: 40,
}

const requestContextStorage = new AsyncLocalStorage<TelemetryRequestContext>()

/** Create the live registry with meters, tracer, ALS context, and metric recorders. */
export function createActiveRegistry(
  config: TelemetryConfig,
): TelemetryRegistry {
  const meter = otelMetrics.getMeter(config.serviceName)
  const tracer = trace.getTracer(config.serviceName)

  const requestDuration = meter.createHistogram(
    "http.server.request.duration",
    { unit: "ms" },
  )
  const activeRequests = meter.createUpDownCounter(
    "http.server.active_requests",
  )
  const requestStatus = meter.createCounter("http.server.requests")
  const cancellations = meter.createCounter("http.server.cancellations")
  const serverFnDuration = meter.createHistogram(
    "tanstack.server_fn.duration",
    { unit: "ms" },
  )
  const serverFnErrors = meter.createCounter("tanstack.server_fn.errors")
  const serverFnTimeouts = meter.createCounter("tanstack.server_fn.timeouts")
  const dependencyDuration = meter.createHistogram(
    "http.client.dependency.duration",
    { unit: "ms" },
  )
  const dependencyErrors = meter.createCounter("http.client.errors")
  const dependencyTimeouts = meter.createCounter("http.client.timeouts")
  const dependencyRetries = meter.createCounter("http.client.retries")
  const loaderDuration = meter.createHistogram("tanstack.loader.duration", {
    unit: "ms",
  })
  const loaderErrors = meter.createCounter("tanstack.loader.errors")
  const apiClientDuration = meter.createHistogram(
    "http.client.request.duration",
    {
      unit: "ms",
    },
  )
  const apiClientErrors = meter.createCounter("http.client.errors")
  const tokenRefreshCount = meter.createCounter("auth.token_refresh.count")
  const tokenRefreshFailures = meter.createCounter(
    "auth.token_refresh.failures",
  )
  const authRedirectCount = meter.createCounter("auth.redirect.count")

  const minLevel = LOG_LEVEL_ORDER[config.logLevel]

  const registry: TelemetryRegistry = {
    enabled: true,
    enrichContext: (partial) => {
      const current = requestContextStorage.getStore()
      if (!current) return
      requestContextStorage.enterWith({ ...current, ...partial })
    },
    getContext: () => requestContextStorage.getStore(),
    getTraceHeaders: () => {
      const store = requestContextStorage.getStore()
      const carrier: Record<string, string> = {}
      propagation.inject(otelContext.active(), carrier)
      const headers: {
        correlationId?: string
        traceparent?: string
        tracestate?: string
      } = {}
      const traceparent = carrier["traceparent"] || store?.traceparent
      const tracestate = carrier["tracestate"] || store?.tracestate
      if (traceparent) headers.traceparent = traceparent
      if (tracestate) headers.tracestate = tracestate
      if (store?.correlationId) headers.correlationId = store.correlationId
      return headers
    },
    log: (level, message, attributes) => {
      if (LOG_LEVEL_ORDER[level] < minLevel) return
      const span = trace.getActiveSpan()
      if (!span) return

      const store = requestContextStorage.getStore()
      const safeAttributes = redactAttributes(attributes)
      const eventAttributes: Record<string, boolean | number | string> = {
        "log.level": level,
      }
      if (store?.correlationId) {
        eventAttributes.requestId = store.correlationId
        eventAttributes["correlation.id"] = store.correlationId
      }
      if (store?.routeId) eventAttributes.routeId = store.routeId
      if (store?.method) eventAttributes.httpMethod = store.method
      if (store?.userId) eventAttributes.userId = store.userId
      if (store?.browserSessionId) {
        eventAttributes.browserSessionId = store.browserSessionId
        eventAttributes["browser.session.id"] = store.browserSessionId
      }

      for (const [key, value] of Object.entries(
        collectTelemetryPrimitives(safeAttributes),
      )) {
        eventAttributes[key] = value
      }
      span.addEvent(redactErrorMessage(message), eventAttributes)
    },
    markHttpResponse: (statusCode) => {
      const span = trace.getActiveSpan()
      if (!span) return
      span.setAttribute("http.status_code", statusCode)
      if (statusCode >= 500) {
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: `HTTP ${statusCode}`,
        })
        return
      }
      span.setStatus({ code: SpanStatusCode.OK })
    },
    metrics: {
      recordApiClient: ({
        "browser.session.id": browserSessionId,
        durationMs,
        error,
        method,
        resource,
        statusCode,
        timedOut,
      }) => {
        const attrs = {
          method,
          resource,
          status_class:
            statusCode === undefined ? "none" : statusClass(statusCode),
          ...(browserSessionId && { browser_session_id: browserSessionId }),
        }
        apiClientDuration.record(durationMs, attrs)
        dependencyDuration.record(durationMs, {
          status_class:
            statusCode === undefined ? "none" : statusClass(statusCode),
        })
        if (error) {
          apiClientErrors.add(1, attrs)
          dependencyErrors.add(1, {
            status_class:
              statusCode === undefined ? "none" : statusClass(statusCode),
          })
        }
        if (timedOut) dependencyTimeouts.add(1)
      },
      recordApiClientError: ({ method, resource }) => {
        apiClientErrors.add(1, { method, resource })
      },
      recordAuthRedirect: ({ reason, routeId }) => {
        const attrs: Record<string, string> = {}
        if (reason) attrs.reason = reason
        if (routeId) attrs.route_id = routeId
        authRedirectCount.add(1, attrs)
      },
      recordDependency: ({
        durationMs,
        error,
        retried,
        statusCode,
        timedOut,
      }) => {
        const attrs = {
          status_class:
            statusCode === undefined ? "none" : statusClass(statusCode),
        }
        dependencyDuration.record(durationMs, attrs)
        if (error) dependencyErrors.add(1, attrs)
        if (timedOut) dependencyTimeouts.add(1)
        if (retried) dependencyRetries.add(1)
      },
      recordLoader: ({ durationMs, error, routeId }) => {
        const attrs = { route_id: routeId }
        loaderDuration.record(durationMs, attrs)
        if (error) loaderErrors.add(1, attrs)
      },
      recordRequestEnd: ({ cancelled, durationMs, statusCode }) => {
        activeRequests.add(-1)
        const attrs = { status_class: statusClass(statusCode) }
        requestDuration.record(durationMs, attrs)
        requestStatus.add(1, attrs)
        if (cancelled) cancellations.add(1)
      },
      recordRequestStart: () => {
        activeRequests.add(1)
      },
      recordServerFn: ({ durationMs, error, name, timedOut }) => {
        const attrs = { server_fn: name }
        serverFnDuration.record(durationMs, attrs)
        if (error) serverFnErrors.add(1, attrs)
        if (timedOut) serverFnTimeouts.add(1, attrs)
      },
      recordTokenRefresh: ({ failed }) => {
        tokenRefreshCount.add(1)
        if (failed) tokenRefreshFailures.add(1)
      },
    },
    recordException: (error, attributes) => {
      const span = trace.getActiveSpan()
      const err = toError(error)
      const safeAttributes = redactAttributes(attributes)
      span?.recordException(err)
      span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message })
      for (const [key, value] of Object.entries(
        collectTelemetryPrimitives(safeAttributes),
      )) {
        span?.setAttribute(key, value)
      }
      registry.log("error", err.message, {
        ...safeAttributes,
        exception: true,
      })
    },
    runWithContext: (ctx, fn) => requestContextStorage.run(ctx, fn),
    shutdown: () =>
      Effect.runPromise(
        Effect.ensuring(
          Effect.ignore(
            Effect.tryPromise({
              catch: (error) => error,
              try: () => shutdownAzureMonitor(),
            }),
          ),
          Effect.sync(() => {
            registry.status = "down"
            registry.enabled = false
          }),
        ),
      ),
    status: "up",
    withSpan: (name, attributes, fn) =>
      tracer.startActiveSpan(name, (span) => {
        const safeAttributes = redactAttributes(attributes)
        for (const [key, value] of Object.entries(
          collectTelemetryPrimitives(safeAttributes),
        )) {
          span.setAttribute(key, value)
        }

        return Effect.runPromiseExit(
          Effect.ensuring(
            Effect.tapError(
              Effect.tryPromise({
                catch: (error) => error,
                try: async () => await fn(),
              }),
              (error) =>
                Effect.sync(() => {
                  if (isRedirect(error)) return
                  registry.recordException(error)
                }),
            ),
            Effect.sync(() => span.end()),
          ),
        ).then((exit) => {
          if (exit._tag === "Failure") {
            throw Cause.squash(exit.cause)
          }
          return exit.value
        })
      }),
  }

  installAxiosHooks(registry, tracer)

  return registry
}
