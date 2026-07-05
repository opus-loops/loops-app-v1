/**
 * TanStack Start telemetry middleware (server-only at runtime).
 *
 * Registered in `src/start.ts` as {@link telemetryFunctionMiddleware}.
 */
import { createMiddleware } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { randomUUID } from "node:crypto"

import { BROWSER_SESSION_ID_HEADER } from "@/modules/shared/telemetry/browser-session"
import { getCallStackAttributes } from "@/modules/shared/telemetry/call-context-path"
import { parseCallStackHeader } from "@/modules/shared/telemetry/call-context-wire"
import { CALL_STACK_HEADER } from "@/modules/shared/telemetry/call-context.types"
import {
  readCallContextStack,
  runWithInboundCallStack,
} from "@/modules/shared/telemetry/run-with-call-context"

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
 * - `x-call-stack` — client/server call path for nested tracing
 *
 * Replays the inbound call stack with the current server function as the innermost
 * caller, then:
 *
 * - Runs the handler inside telemetry context (`path: "/_serverFn"`)
 * - Creates a span via {@link serverFunctionSpanName}
 * - Emits a `serverFn.duration` histogram (error and timeout flags)
 * - Records exceptions with `source: "serverFn"`
 *
 * Span attributes include `serverFunctionName`, call-stack fields from
 * {@link getCallStackAttributes}, and browser session fields from
 * {@link getBrowserSessionAttributes}.
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
  const inboundStack =
    parseCallStackHeader(requestHeaders.get(CALL_STACK_HEADER)) ?? []
  const caller = {
    name: serverFunctionName,
    queryKey: inboundStack.at(-1)?.queryKey,
    routeId: inboundStack.at(-1)?.routeId,
    triggeredBy: inboundStack.at(-1)?.type,
    type: "serverFn" as const,
  }
  const replayStack = [...inboundStack, caller]

  return telemetry.runWithContext(
    {
      browserSessionId,
      correlationId,
      method,
      path: "/_serverFn",
    },
    () =>
      runWithInboundCallStack(replayStack, () =>
        runTelemetryExit({
          attributes: {
            httpMethod: method,
            serverFunctionName,
            ...getCallStackAttributes(readCallContextStack()),
            ...getBrowserSessionAttributes(browserSessionId),
          },
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
          try: async () => {
            const result = await telemetry.withSpan(
              serverFunctionSpanName(serverFunctionName),
              {
                httpMethod: method,
                serverFunctionName,
                ...getCallStackAttributes(readCallContextStack()),
                ...getBrowserSessionAttributes(browserSessionId),
              },
              async () => await next(),
            )
            return result
          },
        }),
      ),
  )
})
