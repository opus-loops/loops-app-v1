import type {
  TelemetryAttributes,
  TelemetryLogLevel,
  TelemetryRegistry,
  TelemetryRequestContext,
  TelemetryStatus,
} from "./types"

/**
 * Process-global telemetry accessor.
 *
 * Reads and writes {@link globalThis.__LOOPS_TELEMETRY__}, the bridge between
 * server-only OpenTelemetry setup and shared modules (axios, server-fn failure
 * handlers) that must not import Azure Monitor packages directly.
 */

/** No-op registry used when telemetry is disabled or not yet initialized. */
const noopRegistry: TelemetryRegistry = {
  enabled: false,
  enrichContext: () => {
    /* noop */
  },
  getContext: () => undefined,
  getTraceHeaders: () => ({}),
  log: () => undefined,
  markHttpResponse: () => undefined,
  metrics: {
    recordApiClient: () => undefined,
    recordApiClientError: () => undefined,
    recordAuthRedirect: () => undefined,
    recordDependency: () => undefined,
    recordLoader: () => undefined,
    recordRequestEnd: () => undefined,
    recordRequestStart: () => undefined,
    recordServerFn: () => undefined,
    recordTokenRefresh: () => undefined,
  },
  recordException: () => undefined,
  runWithContext: <T>(
    _context: TelemetryRequestContext,
    fn: () => Promise<T> | T,
  ) => fn(),
  shutdown: async () => undefined,
  status: "disabled",
  withSpan: async <T>(
    _name: string,
    _attributes: TelemetryAttributes | undefined,
    fn: () => Promise<T> | T,
  ) => await fn(),
}

/**
 * Build a no-op registry with an explicit status (e.g. `"down"` after startup failure).
 *
 * @param status - Reported telemetry status; defaults to `"disabled"`.
 */
export function createNoopTelemetryRegistry(
  status: TelemetryStatus = "disabled",
): TelemetryRegistry {
  return normalizeRegistry({
    ...noopRegistry,
    enabled: false,
    status,
  })
}

/**
 * Return the active telemetry registry, or a no-op fallback when none is set.
 *
 * Normalizes partial registries (e.g. stale `instrument.server.mjs` after HMR)
 * so every {@link TelemetryRegistry} method is always callable.
 */
export function getTelemetry(): TelemetryRegistry {
  const registry = globalThis.__LOOPS_TELEMETRY__
  if (!registry) return noopRegistry
  return normalizeRegistry(registry)
}

/** Current telemetry health: `"up"`, `"down"`, or `"disabled"`. */
export function getTelemetryStatus(): TelemetryStatus {
  return getTelemetry().status
}

/**
 * Emit a structured log at the given level via the active registry.
 *
 * @param level - Minimum-respected log level (`trace` … `fatal`).
 * @param message - Log message; sensitive values are redacted by the registry.
 * @param attributes - Optional key/value attributes attached to the log event.
 */
export function logTelemetry(
  level: TelemetryLogLevel,
  message: string,
  attributes?: TelemetryAttributes,
): void {
  getTelemetry().log(level, message, attributes)
}

/**
 * Record an exception on the active trace via the global registry.
 *
 * Prefer this over importing OpenTelemetry directly from shared modules.
 *
 * @param error - Thrown value or Error instance.
 * @param attributes - Optional context (source, error code, etc.).
 */
export const recordServerException = (
  error: unknown,
  attributes?: TelemetryAttributes,
) => getTelemetry().recordException(error, attributes)

/**
 * Install or clear the process-global telemetry registry.
 *
 * Called once by {@link ./setup.startTelemetry} at startup. Passing
 * `undefined` clears the global slot.
 *
 * @param registry - Active registry from setup, or `undefined` to unset.
 */
export function setTelemetry(registry: TelemetryRegistry | undefined): void {
  globalThis.__LOOPS_TELEMETRY__ = registry
    ? normalizeRegistry(registry)
    : undefined
}

/**
 * Merge a registry with {@link noopRegistry} so missing methods never throw.
 *
 * @param registry - Registry that may be partial (older preload shape).
 */
function normalizeRegistry(registry: TelemetryRegistry): TelemetryRegistry {
  return {
    ...noopRegistry,
    ...registry,
    metrics: {
      ...noopRegistry.metrics,
      ...registry.metrics,
    },
  }
}
