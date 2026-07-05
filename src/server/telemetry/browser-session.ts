import {
  BROWSER_SESSION_ID_HEADER,
  createBrowserSessionId,
  normalizeBrowserSessionId,
} from "@/modules/shared/telemetry/browser-session"

/** Flatten browser session id for OpenTelemetry span / metric attributes. */
export function getBrowserSessionAttributes(
  browserSessionId: string | undefined,
): Record<string, string> {
  if (!browserSessionId) return {}
  return { "browser.session.id": browserSessionId }
}

/** Resolve browser tab session id from an incoming request (header or new id). */
export const resolveBrowserSessionId = (request: Request): string =>
  resolveBrowserSessionIdFromHeader(
    request.headers.get(BROWSER_SESSION_ID_HEADER),
  )

/** Resolve browser tab session id from a request header value (or create one). */
export const resolveBrowserSessionIdFromHeader = (
  headerValue: null | string,
): string => normalizeBrowserSessionId(headerValue) ?? createBrowserSessionId()

export { BROWSER_SESSION_ID_HEADER }
