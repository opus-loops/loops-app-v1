import { hasCryptoRandomUuid } from "./runtime"

/** sessionStorage key for the tab session id (browser RUM only). */
export const BROWSER_SESSION_STORAGE_KEY = "loops.browserSessionId"

/** Create a new browser tab session id. */
export function createBrowserSessionId(): string {
  if (hasCryptoRandomUuid()) return crypto.randomUUID()

  return `sess-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/** Validate and normalize a browser session id value. */
export function normalizeBrowserSessionId(
  value: null | string | undefined,
): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed || trimmed.length > 128) return undefined
  if (!/^[a-zA-Z0-9-]{8,128}$/.test(trimmed)) return undefined
  return trimmed
}
