/**
 * UI page route classification for telemetry filtering.
 *
 * Only paths passing {@link isPageRoute} receive spans and request metrics.
 * Excludes static assets and `/_server*`. Health probes handled in {@link ./request}.
 */

/** Regex matching common static asset file extensions. */
const STATIC_FILE_EXTENSION =
  /\.(?:js|mjs|cjs|map|css|scss|sass|less|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|otf|mp4|webm|mp3|wav|pdf|json|txt|xml|webmanifest|wasm|html)$/i

/** Paths never instrumented as UI page routes. */
const EXCLUDED_EXACT = new Set([
  "/favicon.ico",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
  "/sw.js",
])

/** Path prefixes excluded from page-route instrumentation. */
const EXCLUDED_PREFIXES = [
  "/_serverFn",
  "/assets/",
  "/icons/",
  "/images/",
  "/screenshots/",
  "/fonts/",
  "/.well-known",
]

/**
 * True when `pathname` is a frontend UI page route (e.g. `/auth`, `/explore`).
 *
 * @param pathname - URL pathname without query string.
 */
export function isPageRoute(pathname: string): boolean {
  const path = normalizePathname(pathname)
  if (path === "") return false
  if (EXCLUDED_EXACT.has(path)) return false
  if (STATIC_FILE_EXTENSION.test(path)) return false
  return EXCLUDED_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function normalizePathname(pathname: string): string {
  if (!pathname) return ""
  const withLeadingSlash = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/"))
    return withLeadingSlash.slice(0, -1)
  return withLeadingSlash
}
