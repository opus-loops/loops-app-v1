import {
  bootstrapBrowserSessionId,
  BROWSER_SESSION_ID_HEADER,
  ensureBrowserSessionId,
  syncBrowserSessionIdFromResponse,
} from "@/modules/shared/telemetry/browser-session-client"

import { CALL_STACK_HEADER, serializeCallStack } from "./call-context-wire"
import { readCallContextStack } from "./run-with-call-context"
import { isBrowserRuntime, resolveFetchInputUrl } from "./runtime"

declare global {
  var __LOOPS_TELEMETRY_FETCH_INSTALLED__: boolean | undefined
}

/** Propagate tab session + full call stack on browser fetch requests. */
export function installClientTelemetryFetch(): void {
  if (!isBrowserRuntime()) return
  if (globalThis.__LOOPS_TELEMETRY_FETCH_INSTALLED__) return
  globalThis.__LOOPS_TELEMETRY_FETCH_INSTALLED__ = true

  bootstrapBrowserSessionId()

  const originalFetch = globalThis.fetch.bind(globalThis)
  globalThis.fetch = (input, init) => {
    const url = resolveFetchInputUrl(input)

    const headers = new Headers(init?.headers)
    headers.set(BROWSER_SESSION_ID_HEADER, ensureBrowserSessionId())

    if (url.includes("/_serverFn")) {
      const stack = readCallContextStack()
      if (stack.length > 0) {
        headers.set(CALL_STACK_HEADER, serializeCallStack(stack))
      }
    }

    return originalFetch(input, { ...init, headers }).then((response) => {
      syncBrowserSessionIdFromResponse(response)
      return response
    })
  }
}
