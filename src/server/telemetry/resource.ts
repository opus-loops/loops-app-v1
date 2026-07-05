import { runSyncOrElse } from "@/modules/shared/telemetry/effect"

/**
 * Normalize an API URL/path to a low-cardinality resource label.
 * Dynamic ids are replaced with `:id`.
 */
export function normalizeApiResource(urlOrPath: string): string {
  return runSyncOrElse(() => {
    const path = urlOrPath.startsWith("http")
      ? new URL(urlOrPath).pathname
      : (urlOrPath.split("?")[0] ?? urlOrPath)
    const normalized = path
      .replace(/\/[0-9a-fA-F]{24}\b/g, "/:id")
      .replace(
        /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi,
        "/:id",
      )
      .replace(/^\//, "")
      .replace(/\//g, ".")
    return normalized || "root"
  }, "unknown")
}

/** Normalize a route path to a stable low-cardinality route id. */
export function normalizeRouteId(routeId: string): string {
  const trimmed = routeId.trim()
  if (!trimmed || trimmed === "/") return "/"
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}
