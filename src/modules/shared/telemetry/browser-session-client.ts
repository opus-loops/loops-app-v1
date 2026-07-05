import {
  BROWSER_SESSION_ID_HEADER,
  BROWSER_SESSION_META_NAME,
  BROWSER_SESSION_STORAGE_KEY,
  createBrowserSessionId,
  normalizeBrowserSessionId,
} from "./browser-session"
import { runSyncOrElse } from "./effect"
import { isBrowserRuntime } from "./runtime"

export {
  BROWSER_SESSION_ID_HEADER,
  BROWSER_SESSION_META_NAME,
  BROWSER_SESSION_STORAGE_KEY,
  createBrowserSessionId,
  normalizeBrowserSessionId,
}

/**
 * On first hydration, adopt SSR session id from `<meta name="loops-session-id">`
 * so SSR and client share the same tab session.
 */
export function bootstrapBrowserSessionId(): void {
  if (!isBrowserRuntime()) return
  if (getBrowserSessionId()) return

  const fromMeta = normalizeBrowserSessionId(
    document
      .querySelector(`meta[name="${BROWSER_SESSION_META_NAME}"]`)
      ?.getAttribute("content"),
  )
  if (fromMeta) {
    persistBrowserSessionId(fromMeta)
    return
  }

  ensureBrowserSessionId()
}

/** Get or create tab session id in sessionStorage. */
export function ensureBrowserSessionId(): string {
  const existing = getBrowserSessionId()
  if (existing) return existing

  const id = createBrowserSessionId()
  persistBrowserSessionId(id)
  return id
}

/** Read tab session id from sessionStorage (browser only). */
export function getBrowserSessionId(): string | undefined {
  if (!isBrowserRuntime()) return undefined

  return runSyncOrElse(() => {
    const stored = sessionStorage.getItem(BROWSER_SESSION_STORAGE_KEY)
    return normalizeBrowserSessionId(stored) ?? undefined
  }, undefined)
}

/** Persist tab session id to sessionStorage. */
export function persistBrowserSessionId(id: string): void {
  if (!isBrowserRuntime()) return
  const normalized = normalizeBrowserSessionId(id)
  if (!normalized) return

  runSyncOrElse(() => {
    sessionStorage.setItem(BROWSER_SESSION_STORAGE_KEY, normalized)
  }, undefined)
}

/** Adopt session id from a fetch response header when present. */
export function syncBrowserSessionIdFromResponse(response: Response): void {
  persistBrowserSessionId(response.headers.get(BROWSER_SESSION_ID_HEADER) ?? "")
}
