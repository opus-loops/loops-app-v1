import {
  bootstrapBrowserSessionId,
  BROWSER_SESSION_ID_HEADER,
  ensureBrowserSessionId,
  syncBrowserSessionIdFromResponse,
} from "@/modules/shared/telemetry/browser-session-client"

import { isBrowserRuntime } from "./runtime"

declare global {
  var __LOOPS_TELEMETRY_FETCH_INSTALLED__: boolean | undefined
}

/** Propagate tab session id on browser fetch requests. */
export function installClientTelemetryFetch(): void {
  if (!isBrowserRuntime()) return
  if (globalThis.__LOOPS_TELEMETRY_FETCH_INSTALLED__) return
  globalThis.__LOOPS_TELEMETRY_FETCH_INSTALLED__ = true

  bootstrapBrowserSessionId()

  const originalFetch = globalThis.fetch.bind(globalThis)
  globalThis.fetch = (input, init) => {
    const headers = new Headers(init?.headers)
    headers.set(BROWSER_SESSION_ID_HEADER, ensureBrowserSessionId())

    return originalFetch(input, { ...init, headers }).then((response) => {
      syncBrowserSessionIdFromResponse(response)
      return response
    })
  }
}
