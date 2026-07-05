/**
 * Server fetch entry instrumentation: probes, page-route spans, request metrics.
 *
 * Wraps TanStack Start `handler.fetch` from {@link ../../server} and {@link ../../entry-server}.
 * Server-only — imports `@tanstack/react-start/server-only`.
 */
import "@tanstack/react-start/server-only"
import { randomUUID } from "node:crypto"

import type { TelemetryRequestContext } from "./types"

import {
  BROWSER_SESSION_ID_HEADER,
  getBrowserSessionAttributes,
  resolveBrowserSessionId,
} from "./browser-session"
import { runTelemetryExit } from "./effect"
import { getLivenessResponse, getReadinessResponse } from "./health"
import { isPageRoute } from "./page-route"
import { getTelemetry } from "./registry"

/**
 * Handle an incoming fetch: health probes, filter non-page routes, instrument UI pages.
 *
 * For page routes: binds correlation context, records request metrics, creates span,
 * sets `x-correlation-id` on the response. Static assets and `/_serverFn` pass through untouched.
 *
 * @param request - Incoming Request.
 * @param fetchHandler - Inner handler (typically TanStack `handler.fetch`).
 */
export async function handleInstrumentedRequest(
  request: Request,
  fetchHandler: (request: Request) => Promise<Response> | Response,
): Promise<Response> {
  const telemetry = getTelemetry()
  const requestContext = createRequestContext(request)
  const url = new URL(request.url)

  if (request.method === "GET" && url.pathname === "/health") {
    return jsonResponse(
      getLivenessResponse(),
      200,
      requestContext.correlationId,
    )
  }

  if (request.method === "GET" && url.pathname === "/ready") {
    return jsonResponse(
      getReadinessResponse(),
      200,
      requestContext.correlationId,
    )
  }

  if (!isPageRoute(url.pathname)) {
    return fetchHandler(request)
  }

  return telemetry.runWithContext(requestContext, async () => {
    const startedAt = performance.now()
    telemetry.metrics.recordRequestStart()
    let statusCode = 500
    const signal = request.signal
    let cancelled = signal.aborted === true

    const onAbort = () => {
      cancelled = true
    }
    signal.addEventListener("abort", onAbort, { once: true })

    return runTelemetryExit({
      attributes: {
        "correlation.id": requestContext.correlationId,
        "http.method": request.method,
        "http.route": url.pathname,
        ...getBrowserSessionAttributes(requestContext.browserSessionId),
      },
      onFinally: () => {
        signal.removeEventListener("abort", onAbort)
        telemetry.metrics.recordRequestEnd({
          cancelled: cancelled || signal.aborted === true,
          durationMs: performance.now() - startedAt,
          statusCode,
        })
      },
      recordException: (error, attributes) =>
        telemetry.recordException(error, attributes),
      try: async () => {
        const response = await telemetry.withSpan(
          `${request.method} ${url.pathname}`,
          {
            "correlation.id": requestContext.correlationId,
            "http.method": request.method,
            "http.route": url.pathname,
            ...getBrowserSessionAttributes(requestContext.browserSessionId),
          },
          async () => await fetchHandler(request),
        )
        statusCode = response.status
        telemetry.markHttpResponse(statusCode)
        return withBrowserSessionHeader(
          withCorrelationHeader(response, requestContext.correlationId),
          requestContext.browserSessionId,
        )
      },
    })
  })
}

/** Build request context from headers and URL (pathname only for path). */
function createRequestContext(request: Request): TelemetryRequestContext {
  const url = new URL(request.url)
  const browserSessionId = resolveBrowserSessionId(request)
  return {
    browserSessionId,
    correlationId:
      request.headers.get("x-correlation-id")?.trim() || randomUUID(),
    method: request.method,
    path: url.pathname,
    routeId: url.pathname,
    traceparent: request.headers.get("traceparent") ?? undefined,
    tracestate: request.headers.get("tracestate") ?? undefined,
  }
}

/** JSON Response with optional `x-correlation-id` header. */
function jsonResponse(
  body: unknown,
  status = 200,
  correlationId?: string,
): Response {
  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
  })
  if (correlationId) {
    headers.set("x-correlation-id", correlationId)
  }
  return new Response(JSON.stringify(body), { headers, status })
}

/** Clone response with `x-loops-session-id` for client tab session bootstrap. */
function withBrowserSessionHeader(
  response: Response,
  browserSessionId: string | undefined,
): Response {
  if (!browserSessionId) return response
  const headers = new Headers(response.headers)
  headers.set(BROWSER_SESSION_ID_HEADER, browserSessionId)
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  })
}

/** Clone response with `x-correlation-id` set for downstream clients. */
function withCorrelationHeader(
  response: Response,
  correlationId: string,
): Response {
  const headers = new Headers(response.headers)
  headers.set("x-correlation-id", correlationId)
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  })
}
