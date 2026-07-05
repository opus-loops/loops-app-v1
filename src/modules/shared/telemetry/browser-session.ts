import { hasCryptoRandomUuid } from "./runtime"

/** HTTP header carrying the browser tab session id (one id per tab / sessionStorage). */
export const BROWSER_SESSION_ID_HEADER = "x-loops-session-id"

/** sessionStorage key for the tab session id. */
export const BROWSER_SESSION_STORAGE_KEY = "loops.browserSessionId"

/** `<meta name="loops-session-id">` — SSR seeds the client tab session. */
export const BROWSER_SESSION_META_NAME = "loops-session-id"

/** Create a new browser tab session id. */
export function createBrowserSessionId(): string {
  if (hasCryptoRandomUuid()) return crypto.randomUUID()

  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/** Validate and normalize an inbound browser session id header value. */
export function normalizeBrowserSessionId(
  value: null | string | undefined,
): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed || trimmed.length > 128) return undefined
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(trimmed)) return undefined
  return trimmed
}
