/**
 * Telemetry environment configuration.
 *
 * Prefer {@link createTelemetryConfig} (injectable env). Process singleton
 * {@link telemetryConfig} is parsed at first import — {@link ./instrument.ts}
 * must hydrate `.env` before importing this module.
 *
 * Environment variables:
 * - `TELEMETRY_ENABLED` — master switch (`"true"` only)
 * - `TELEMETRY_DEBUG` — startup diagnostics without logging secrets
 * - `APPLICATIONINSIGHTS_CONNECTION_STRING` — Azure App Insights connection string
 * - `TELEMETRY_PROVIDER` — `"azure"` (default) or `"otlp"` (placeholder)
 * - `OTEL_SERVICE_NAME` — OTel resource / meter name (default `loops-dashboard`)
 * - `TELEMETRY_SAMPLING_RATIO` / `TELEMETRY_TRACES_SAMPLE_RATE` — trace sampling `0.0`–`1.0`
 * - `TELEMETRY_LOG_LEVEL` — minimum span log level (default `info`)
 *
 * @module telemetry/config
 */
import type { TelemetryLogLevel } from "./types"

const TELEMETRY_LOG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const satisfies ReadonlyArray<TelemetryLogLevel>

const parseBoolean = (value: string | undefined) => value === "true"

const parseSamplingRatio = (value: string | undefined, fallback: number) => {
  if (!value) return fallback
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1
    ? parsed
    : fallback
}

const parseLogLevel = (value: string | undefined): TelemetryLogLevel => {
  const normalized = value?.trim().toLowerCase()
  if (
    normalized &&
    (TELEMETRY_LOG_LEVELS as ReadonlyArray<string>).includes(normalized)
  )
    return normalized as TelemetryLogLevel
  return "info"
}

const INSTRUMENTATION_KEY_PATTERN =
  /InstrumentationKey=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

/** Reason an Application Insights connection string failed validation. */
export type ConnectionStringIssue = "malformed" | "missing"

/**
 * Validates and normalizes `APPLICATIONINSIGHTS_CONNECTION_STRING`.
 * Rejects empty values and strings missing a well-formed `InstrumentationKey=<guid>`.
 */
const parseConnectionString = (
  raw: string | undefined,
): { issue?: ConnectionStringIssue; value?: string } => {
  const trimmed = raw?.trim()
  if (!trimmed) return { issue: "missing" }

  if (!INSTRUMENTATION_KEY_PATTERN.test(trimmed)) {
    return { issue: "malformed" }
  }

  return { value: trimmed }
}

/**
 * Build resolved telemetry settings from an env map (testable).
 */
export function createTelemetryConfig(
  processEnv: NodeJS.ProcessEnv = process.env,
) {
  const env = processEnv.ENV ?? processEnv.NODE_ENV ?? "development"
  const isProduction = env === "production"
  const isDevelopment = env === "development"
  const enabled = parseBoolean(processEnv.TELEMETRY_ENABLED)
  const debug = parseBoolean(processEnv.TELEMETRY_DEBUG)
  const provider = processEnv.TELEMETRY_PROVIDER ?? "azure"
  const serviceName = processEnv.OTEL_SERVICE_NAME ?? "loops-dashboard"
  const logLevel = parseLogLevel(processEnv.TELEMETRY_LOG_LEVEL)

  const connectionStringResult = parseConnectionString(
    processEnv.APPLICATIONINSIGHTS_CONNECTION_STRING,
  )

  const samplingRatio = parseSamplingRatio(
    processEnv.TELEMETRY_SAMPLING_RATIO ??
      processEnv.TELEMETRY_TRACES_SAMPLE_RATE,
    isProduction ? 0.25 : 1,
  )

  return {
    connectionString: connectionStringResult.value,
    connectionStringIssue: connectionStringResult.issue,
    debug,
    enabled,
    env,
    invalidConnectionString:
      enabled && connectionStringResult.issue === "malformed",
    isDevelopment,
    isProduction,
    logLevel,
    missingConnectionString:
      enabled && connectionStringResult.issue === "missing",
    provider,
    samplingRatio,
    serviceName,
  } as const
}

/** Resolved telemetry settings for the current process. */
export const telemetryConfig = createTelemetryConfig()

export type TelemetryConfig = ReturnType<typeof createTelemetryConfig>

/**
 * Safe bootstrap snapshot for `TELEMETRY_DEBUG` — never includes secret values.
 */
export const describeTelemetryBootstrap = (
  config: TelemetryConfig = telemetryConfig,
  processEnv: NodeJS.ProcessEnv = process.env,
) => ({
  connectionStringConfigured: Boolean(config.connectionString),
  connectionStringIssue: config.connectionStringIssue,
  enabled: config.enabled,
  env: config.env,
  envFilePath: processEnv.ENV_FILE_PATH,
  provider: config.provider,
  resolvedFrom: {
    applicationInsightsVarLength:
      processEnv.APPLICATIONINSIGHTS_CONNECTION_STRING?.trim().length ?? 0,
    hasApplicationInsightsVar: Boolean(
      processEnv.APPLICATIONINSIGHTS_CONNECTION_STRING?.trim(),
    ),
    telemetryEnabled: processEnv.TELEMETRY_ENABLED ?? "(unset)",
  },
  samplingRatio: config.samplingRatio,
  serviceName: config.serviceName,
})
