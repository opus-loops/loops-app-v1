/**
 * Shared telemetry types for the server-only Azure Monitor OpenTelemetry layer.
 */
export type TelemetryAttributes = Record<
  string,
  boolean | number | string | undefined
>

export type TelemetryLogLevel =
  | "debug"
  | "error"
  | "fatal"
  | "info"
  | "trace"
  | "warn"

export type TelemetryRegistry = {
  enabled: boolean
  enrichContext: (partial: Partial<TelemetryRequestContext>) => void
  getContext: () => TelemetryRequestContext | undefined
  getTraceHeaders: () => {
    correlationId?: string | undefined
    traceparent?: string | undefined
    tracestate?: string | undefined
  }
  log: (
    level: TelemetryLogLevel,
    message: string,
    attributes?: TelemetryAttributes,
  ) => void
  markHttpResponse: (statusCode: number) => void
  metrics: {
    recordApiClient: (input: {
      "browser.session.id"?: string | undefined
      durationMs: number
      error: boolean
      method: string
      resource: string
      statusCode?: number | undefined
      timedOut: boolean
    }) => void
    recordApiClientError: (input: { method: string; resource: string }) => void
    recordAuthRedirect: (input: {
      reason?: string | undefined
      routeId?: string | undefined
    }) => void
    recordDependency: (input: {
      durationMs: number
      error: boolean
      retried: boolean
      statusCode?: number | undefined
      timedOut: boolean
    }) => void
    recordLoader: (input: {
      durationMs: number
      error: boolean
      routeId: string
    }) => void
    recordRequestEnd: (input: {
      cancelled: boolean
      durationMs: number
      statusCode: number
    }) => void
    recordRequestStart: () => void
    recordServerFn: (input: {
      durationMs: number
      error: boolean
      name: string
      timedOut: boolean
    }) => void
    recordTokenRefresh: (input: { failed: boolean }) => void
  }
  recordException: (error: unknown, attributes?: TelemetryAttributes) => void
  runWithContext: <T>(
    context: TelemetryRequestContext,
    fn: () => Promise<T> | T,
  ) => Promise<T> | T
  shutdown: () => Promise<void>
  status: TelemetryStatus
  withSpan: <T>(
    name: string,
    attributes: TelemetryAttributes | undefined,
    fn: () => Promise<T> | T,
  ) => Promise<T>
}

export type TelemetryRequestContext = {
  browserSessionId?: string | undefined
  correlationId: string
  method: string
  path: string
  routeId?: string | undefined
  sessionPresent?: boolean | undefined
  traceparent?: string | undefined
  tracestate?: string | undefined
  userId?: string | undefined
}

export type TelemetryStatus = "disabled" | "down" | "up"

declare global {
  var __LOOPS_TELEMETRY__: TelemetryRegistry | undefined
}

export {}
