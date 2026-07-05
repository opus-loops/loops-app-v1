/**
 * Telemetry configuration parsed from server-only environment variables.
 */
import { Either } from "effect"

import type { TelemetryLogLevel } from "./types"

import { decodeTelemetryEnv, formatTelemetryEnvError } from "./schema"

export type TelemetryConfig = {
  connectionString: string | undefined
  enabled: boolean
  logLevel: TelemetryLogLevel
  reason: string
  serviceName: string
  tracesSampleRate: number
}

/**
 * Parse and validate telemetry env vars, then apply activation rules.
 *
 * `enabled` is true only when env decode succeeds, `TELEMETRY_ENABLED` is true,
 * and `NODE_ENV` is `production`.
 */
export function parseTelemetryConfig(
  env: NodeJS.ProcessEnv = process.env,
): TelemetryConfig {
  const decoded = decodeTelemetryEnv(env)

  if (Either.isLeft(decoded))
    return createDisabledTelemetryConfig(formatTelemetryEnvError(decoded.left))

  const parsed = decoded.right

  if (!parsed.TELEMETRY_ENABLED)
    return createDisabledTelemetryConfig("TELEMETRY_ENABLED is false", parsed)

  if (parsed.NODE_ENV !== "production")
    return createDisabledTelemetryConfig(
      "Telemetry disabled in non-production environments",
      parsed,
    )

  return {
    connectionString: parsed.APPLICATIONINSIGHTS_CONNECTION_STRING,
    enabled: true,
    logLevel: parsed.TELEMETRY_LOG_LEVEL,
    reason: "",
    serviceName: parsed.OTEL_SERVICE_NAME,
    tracesSampleRate: parsed.TELEMETRY_TRACES_SAMPLE_RATE,
  }
}

function createDisabledTelemetryConfig(
  reason: string,
  parsed?: {
    APPLICATIONINSIGHTS_CONNECTION_STRING: string
    OTEL_SERVICE_NAME: string
    TELEMETRY_LOG_LEVEL: TelemetryLogLevel
    TELEMETRY_TRACES_SAMPLE_RATE: number
  },
): TelemetryConfig {
  return {
    connectionString: parsed?.APPLICATIONINSIGHTS_CONNECTION_STRING,
    enabled: false,
    logLevel: parsed?.TELEMETRY_LOG_LEVEL ?? "info",
    reason,
    serviceName: parsed?.OTEL_SERVICE_NAME ?? "loops-app",
    tracesSampleRate: parsed?.TELEMETRY_TRACES_SAMPLE_RATE ?? 1,
  }
}
