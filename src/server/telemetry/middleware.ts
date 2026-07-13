/**
 * TanStack Start telemetry middleware (server-only at runtime).
 *
 * Registered in `src/start.ts` as {@link telemetryFunctionMiddleware}.
 */
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { randomUUID } from "node:crypto"

import { BROWSER_SESSION_ID_HEADER } from "@/modules/shared/telemetry/browser-session"

import {
  getBrowserSessionAttributes,
  resolveBrowserSessionIdFromHeader,
} from "./browser-session"
import { runTelemetryExit } from "./effect"
import { serverFunctionSpanName } from "./helpers"
import { getTelemetry } from "./registry"
import { decodeAbortSignal } from "./schema"

/**
 * Function middleware that instruments TanStack Start server function calls.
 *
 * Reads inbound correlation from request headers:
 *
 * - `x-loops-session-id` — normalized, or a new id is generated
 * - `x-correlation-id` — trimmed, or a new UUID is generated
 *
 * Then:
 *
 * - Runs the handler inside telemetry context (`path: "/_serverFn"`)
 * - Creates a span via {@link serverFunctionSpanName}
 * - Emits a `serverFn.duration` histogram (error and timeout flags)
 * - Records exceptions with `source: "serverFn"`
 */
export const telemetryFunctionMiddleware = createMiddleware({
  type: "function",
}).server(async ({ method, next, serverFnMeta, signal }) => {
  const telemetry = getTelemetry()
  const serverFunctionName = serverFnMeta.name
  const startedAt = performance.now()
  const requestHeaders = getRequestHeaders()
  const browserSessionId = resolveBrowserSessionIdFromHeader(
    requestHeaders.get(BROWSER_SESSION_ID_HEADER),
  )
  const correlationId =
    requestHeaders.get("x-correlation-id")?.trim() || randomUUID()
  const spanAttributes = {
    httpMethod: method,
    serverFunctionName,
    ...getBrowserSessionAttributes(browserSessionId),
  }

  return telemetry.runWithContext(
    {
      browserSessionId,
      correlationId,
      method,
      path: "/_serverFn",
    },
    () =>
      runTelemetryExit({
        attributes: spanAttributes,
        onFinally: (failed) => {
          const abortSignal = decodeAbortSignal(signal)
          telemetry.metrics.recordServerFn({
            durationMs: performance.now() - startedAt,
            error: failed,
            name: serverFunctionName,
            timedOut: abortSignal?.aborted === true,
          })
        },
        recordException: (error, attributes) =>
          telemetry.recordException(error, {
            ...attributes,
            serverFunctionName,
            source: "serverFn",
          }),
        try: async () =>
          await telemetry.withSpan(
            serverFunctionSpanName(serverFunctionName),
            spanAttributes,
            async () => await next(),
          ),
      }),
  )
})
