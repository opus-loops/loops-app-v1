/**
 * Liveness and readiness probe payloads for `/health` and `/ready`.
 *
 * Served by {@link ./request.handleInstrumentedRequest} without full page-route instrumentation.
 */
import { getTelemetryStatus } from "./registry"

/** JSON body for `GET /health` (process alive). */
export type HealthResponse = {
  memory: {
    rss: number
  }
  status: "ok"
  timestamp: string
  uptime: number
  version: string | undefined
}

/** JSON body for `GET /ready` (includes telemetry subsystem status). */
export type ReadyResponse = {
  memory: {
    rss: number
  }
  status: "ready"
  telemetry: "disabled" | "down" | "up"
  timestamp: string
  uptime: number
}

/** Build liveness probe response with uptime, RSS, and package version. */
export function getLivenessResponse(): HealthResponse {
  return {
    ...processSnapshot(),
    status: "ok",
    version: process.env.npm_package_version,
  }
}

/** Build readiness probe response including {@link getTelemetryStatus}. */
export function getReadinessResponse(): ReadyResponse {
  return {
    ...processSnapshot(),
    status: "ready",
    telemetry: getTelemetryStatus(),
  }
}

/** Minimal process snapshot for probes (RSS only — no full heap dump). */
function processSnapshot() {
  return {
    memory: {
      rss: process.memoryUsage().rss,
    },
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }
}
