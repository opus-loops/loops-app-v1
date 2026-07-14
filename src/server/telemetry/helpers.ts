import { isServerRuntime } from "@/modules/shared/telemetry/runtime"

import type { TelemetryAttributes } from "./types"

import { getTelemetry } from "./registry"
import { normalizeRouteId } from "./resource"

export type ServerMetricInput =
  | { failed?: boolean | undefined; name: "auth.tokenRefresh" }
  | {
      name: "auth.redirect"
      reason?: string | undefined
      routeId?: string | undefined
    }

/** Build correlation attributes merged with the active request context. */
export function buildCorrelationAttributes(
  extra?: TelemetryAttributes,
): TelemetryAttributes {
  const ctx = getTelemetry().getContext()
  const attrs: TelemetryAttributes = {
    ...extra,
  }
  if (ctx?.correlationId) {
    attrs.requestId = ctx.correlationId
    attrs["correlation.id"] = ctx.correlationId
  }
  if (ctx?.routeId) attrs.routeId = ctx.routeId
  if (ctx?.method) attrs.httpMethod = ctx.method
  if (ctx?.userId) attrs.userId = ctx.userId
  if (ctx?.sessionPresent !== undefined) {
    attrs.sessionPresent = ctx.sessionPresent
  }
  return attrs
}

/** Instrument a route `beforeLoad` hook (server only). */
export async function instrumentBeforeLoad<T>(
  routeId: string,
  fn: () => Promise<T> | T,
): Promise<T> {
  const id = normalizeRouteId(routeId)
  return withServerSpan(
    `beforeLoad.${id}`,
    { routeId: id },
    async () => await fn(),
  )
}

export { normalizeApiResource, normalizeRouteId } from "./resource"

export function logServerError(
  message: string,
  attributes?: TelemetryAttributes,
): void {
  if (!isServerRuntime()) return
  getTelemetry().log("error", message, buildCorrelationAttributes(attributes))
}

export function logServerInfo(
  message: string,
  attributes?: TelemetryAttributes,
): void {
  if (!isServerRuntime()) return
  getTelemetry().log("info", message, buildCorrelationAttributes(attributes))
}

export { isServerRuntime } from "@/modules/shared/telemetry/runtime"

/** Record an auth redirect (server only). */
export function recordAuthRedirect(input?: {
  reason?: string | undefined
  routeId?: string | undefined
}): void {
  recordMetric({
    name: "auth.redirect",
    reason: input?.reason,
    routeId: input?.routeId,
  })
  logServerInfo("Auth redirect", {
    reason: input?.reason,
    routeId: input?.routeId ? normalizeRouteId(input.routeId) : undefined,
    source: "auth",
  })
}

/** Record a named server metric (no-op on client or when telemetry disabled). */
export function recordMetric(input: ServerMetricInput): void {
  if (!isServerRuntime()) return
  const metrics = getTelemetry().metrics

  switch (input.name) {
    case "auth.redirect":
      metrics.recordAuthRedirect({
        reason: input.reason,
        routeId: input.routeId ? normalizeRouteId(input.routeId) : undefined,
      })
      return
    case "auth.tokenRefresh":
      metrics.recordTokenRefresh({ failed: input.failed ?? false })
      return
  }
}

/** Resolve semantic span name for a TanStack server function. */
export function serverFunctionSpanName(serverFunctionName: string): string {
  if (serverFunctionName === "isAuthenticated") return "auth.sessionCheck"
  return `serverFn.${serverFunctionName}`
}

/**
 * Run work inside a named server span with correlation attributes.
 * No-op on the client.
 */
export async function withServerSpan<T>(
  name: string,
  attributes: TelemetryAttributes | undefined,
  fn: () => Promise<T> | T,
): Promise<T> {
  if (!isServerRuntime()) return fn()
  return getTelemetry().withSpan(
    name,
    buildCorrelationAttributes(attributes),
    fn,
  )
}
