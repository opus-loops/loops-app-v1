import {
  BROWSER_SESSION_STORAGE_KEY,
  createBrowserSessionId,
  normalizeBrowserSessionId,
} from "./browser-session"
import { runSyncOrElse } from "./effect"
import { isBrowserRuntime } from "./runtime"

export {
  BROWSER_SESSION_STORAGE_KEY,
  createBrowserSessionId,
  normalizeBrowserSessionId,
}

/** Get or create tab session id in sessionStorage (browser RUM). */
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
