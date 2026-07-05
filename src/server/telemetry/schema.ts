/**
 * Effect Schema decoders for telemetry.
 *
 * Two layers:
 *
 * 1. **Environment** — {@link telemetryEnvSchema} validates server-only `process.env`
 *    once at startup via {@link decodeTelemetryEnv}. Consumed by {@link ./config.parseTelemetryConfig}.
 * 2. **Runtime wire** — axios errors, abort signals, and span attribute primitives decoded
 *    per request/span without throwing (optional decode helpers return `undefined` on failure).
 *
 * @see {@link ./config} for activation rules after env decode (`NODE_ENV`, `TELEMETRY_ENABLED`).
 */
import { Either, Option, ParseResult, Predicate, Schema } from "effect"

import type { TelemetryLogLevel } from "./types"

const TELEMETRY_LOG_LEVELS = [
  "trace",
  "debug",
  "info",
  "warn",
  "error",
  "fatal",
] as const satisfies ReadonlyArray<TelemetryLogLevel>

const NODE_ENV_VALUES = ["development", "production", "test"] as const

type NodeEnv = (typeof NODE_ENV_VALUES)[number]

/**
 * Required non-empty trimmed string from `process.env`.
 *
 * Fails when the value is `undefined`, `null`, non-string, or whitespace-only.
 */
const requiredEnvStringSchema = Schema.transformOrFail(
  Schema.Unknown,
  Schema.String,
  {
    decode: (value, _, ast) => {
      if (value === undefined || value === null)
        return ParseResult.fail(new ParseResult.Type(ast, value, "is required"))

      if (typeof value !== "string")
        return ParseResult.fail(
          new ParseResult.Type(ast, value, "expected string environment value"),
        )

      const trimmed = value.trim()
      if (trimmed.length === 0)
        return ParseResult.fail(
          new ParseResult.Type(ast, value, "must not be empty"),
        )

      return ParseResult.succeed(trimmed)
    },
    encode: (value) => ParseResult.succeed(value),
  },
)

/** `NODE_ENV` — one of `development`, `production`, or `test` (case-insensitive). */
const nodeEnvSchema = Schema.transformOrFail(
  requiredEnvStringSchema,
  Schema.Literal(...NODE_ENV_VALUES),
  {
    decode: (value, _, ast) => {
      const normalized = value.toLowerCase()
      if (NODE_ENV_VALUES.includes(normalized as NodeEnv))
        return ParseResult.succeed(normalized as NodeEnv)

      return ParseResult.fail(
        new ParseResult.Type(
          ast,
          value,
          `expected one of: ${NODE_ENV_VALUES.join(", ")}`,
        ),
      )
    },
    encode: (value) => ParseResult.succeed(value),
  },
)

/**
 * `TELEMETRY_ENABLED` — boolean env value.
 *
 * Accepts `true`/`false`, `1`/`0`, `on`/`off`, `yes`/`no` (case-insensitive).
 */
const telemetryEnabledSchema = Schema.transformOrFail(
  requiredEnvStringSchema,
  Schema.Boolean,
  {
    decode: (value, _, ast) => {
      const normalized = value.toLowerCase()
      if (["1", "on", "true", "yes"].includes(normalized))
        return ParseResult.succeed(true)

      if (["0", "false", "no", "off"].includes(normalized))
        return ParseResult.succeed(false)

      return ParseResult.fail(
        new ParseResult.Type(
          ast,
          value,
          "expected true/false (true, false, 1, 0, on, off, yes, no)",
        ),
      )
    },
    encode: (value) => ParseResult.succeed(value ? "true" : "false"),
  },
)

/** `TELEMETRY_LOG_LEVEL` — minimum span log level (case-insensitive). */
const telemetryLogLevelSchema = Schema.transformOrFail(
  requiredEnvStringSchema,
  Schema.Literal(...TELEMETRY_LOG_LEVELS),
  {
    decode: (value, _, ast) => {
      const normalized = value.toLowerCase()
      if (TELEMETRY_LOG_LEVELS.includes(normalized as TelemetryLogLevel))
        return ParseResult.succeed(normalized as TelemetryLogLevel)

      return ParseResult.fail(
        new ParseResult.Type(
          ast,
          value,
          `expected one of: ${TELEMETRY_LOG_LEVELS.join(", ")}`,
        ),
      )
    },
    encode: (value) => ParseResult.succeed(value),
  },
)

/**
 * `APPLICATIONINSIGHTS_CONNECTION_STRING` — Azure Application Insights connection string.
 *
 * Must contain `InstrumentationKey=` and `IngestionEndpoint=`.
 */
const applicationInsightsConnectionStringSchema = requiredEnvStringSchema.pipe(
  Schema.filter(
    (value) =>
      value.includes("InstrumentationKey=") &&
      value.includes("IngestionEndpoint="),
    {
      message: () =>
        "expected Application Insights connection string (InstrumentationKey=...;IngestionEndpoint=...)",
    },
  ),
)

/** `TELEMETRY_TRACES_SAMPLE_RATE` — trace sampling ratio in the inclusive range `0`–`1`. */
const tracesSampleRateSchema = Schema.transformOrFail(
  requiredEnvStringSchema,
  Schema.Number,
  {
    decode: (value, _, ast) => {
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1)
        return ParseResult.fail(
          new ParseResult.Type(ast, value, "expected number between 0 and 1"),
        )

      return ParseResult.succeed(parsed)
    },
    encode: (value) => ParseResult.succeed(String(value)),
  },
)

/**
 * Schema for all required server-only telemetry environment variables.
 *
 * Every field is required; missing or invalid values fail decode.
 *
 * @see {@link decodeTelemetryEnv}
 */
export const telemetryEnvSchema = Schema.Struct({
  APPLICATIONINSIGHTS_CONNECTION_STRING:
    applicationInsightsConnectionStringSchema,
  NODE_ENV: nodeEnvSchema,
  OTEL_SERVICE_NAME: requiredEnvStringSchema,
  TELEMETRY_ENABLED: telemetryEnabledSchema,
  TELEMETRY_LOG_LEVEL: telemetryLogLevelSchema,
  TELEMETRY_TRACES_SAMPLE_RATE: tracesSampleRateSchema,
})

/** Decoded, typed telemetry environment variables. */
export type TelemetryEnv = typeof telemetryEnvSchema.Type

const TELEMETRY_ENV_KEYS = [
  "APPLICATIONINSIGHTS_CONNECTION_STRING",
  "NODE_ENV",
  "OTEL_SERVICE_NAME",
  "TELEMETRY_ENABLED",
  "TELEMETRY_LOG_LEVEL",
  "TELEMETRY_TRACES_SAMPLE_RATE",
] as const satisfies ReadonlyArray<keyof TelemetryEnv>

/**
 * Decode and validate telemetry environment variables from `process.env`.
 *
 * Picks only the keys defined in {@link telemetryEnvSchema}; extra env vars are ignored.
 *
 * @param env - Environment map (defaults to `process.env` at call site).
 * @returns `Right` with typed env on success; `Left` with a {@link ParseResult.ParseError} on failure.
 */
export const decodeTelemetryEnv = (
  env: NodeJS.ProcessEnv,
): Either.Either<TelemetryEnv, ParseResult.ParseError> =>
  Schema.decodeUnknownEither(telemetryEnvSchema)(
    Object.fromEntries(TELEMETRY_ENV_KEYS.map((key) => [key, env[key]])),
  )

/**
 * Format a telemetry env decode error for logging or {@link ./config.TelemetryConfig.reason}.
 *
 * @param error - Parse error from {@link decodeTelemetryEnv}.
 */
export const formatTelemetryEnvError = (
  error: ParseResult.ParseError,
): string => error.message

/**
 * Wire shape for unexpected server-function failures (`{ code: "UnknownError" }`).
 *
 * Local copy — keeps the preload bundle from importing `@/modules/shared/utils/types`.
 */
export const unknownErrorSchema = Schema.Struct({
  code: Schema.Literal("UnknownError"),
})

/**
 * OpenTelemetry-allowed primitive attribute values (string, number, or boolean).
 *
 * Used to filter arbitrary objects before export via {@link collectTelemetryPrimitives}.
 */
export const telemetryPrimitiveSchema = Schema.Union(
  Schema.String,
  Schema.Number,
  Schema.Boolean,
)

/** Plain object with string keys and unknown values (for shallow structural checks). */
export const plainObjectSchema = Schema.Record({
  key: Schema.String,
  value: Schema.Unknown,
})

/**
 * Runtime `AbortSignal` reference guard.
 *
 * Uses `Schema.filter` instead of `Struct` so the original signal instance (and `this`)
 * is preserved — struct decode would copy properties and break cancellation.
 */
export const abortSignalSchema = Schema.filter(
  (value: unknown): value is AbortSignal =>
    Predicate.isRecord(value) &&
    Predicate.hasProperty(value, "aborted") &&
    Predicate.hasProperty(value, "addEventListener") &&
    Predicate.isBoolean((value as AbortSignal).aborted) &&
    Predicate.isFunction((value as AbortSignal).addEventListener),
)(Schema.Unknown)

/** Subset of axios request config fields recorded on dependency spans. */
export const axiosConfigTelemetrySchema = Schema.Struct({
  baseURL: Schema.optional(Schema.String),
  headers: Schema.optional(
    Schema.Record({
      key: Schema.String,
      value: Schema.Unknown,
    }),
  ),
  method: Schema.optional(Schema.String),
  url: Schema.optional(Schema.String),
})

/**
 * Subset of axios error shape safe to decode from `unknown` at the HTTP hook boundary.
 *
 * @see {@link decodeAxiosErrorTelemetry}
 */
export const axiosErrorTelemetrySchema = Schema.Struct({
  code: Schema.optional(Schema.String),
  config: Schema.optional(axiosConfigTelemetrySchema),
  response: Schema.optional(
    Schema.Struct({
      status: Schema.Number,
    }),
  ),
})

/** Decoded axios config fields attached to telemetry spans. */
export type AxiosConfigTelemetry = typeof axiosConfigTelemetrySchema.Type

/** Decoded axios error fields attached to telemetry spans. */
export type AxiosErrorTelemetry = typeof axiosErrorTelemetrySchema.Type

/** Type guard: value is an `Error` instance. */
export const isErrorInstance = Schema.is(Schema.instanceOf(Error))

/** Type guard: value is a plain object (`Record<string, unknown>`). */
export const isPlainObject = Schema.is(plainObjectSchema)

/** Type guard: value is a string. */
export const isString = Schema.is(Schema.String)

/** Type guard: value is a telemetry primitive (string, number, or boolean). */
export const isTelemetryPrimitive = Schema.is(telemetryPrimitiveSchema)

/** Type guard: value matches the `UnknownError` wire union tag. */
export const isUnknownError = Schema.is(unknownErrorSchema)

/**
 * Keep only OpenTelemetry-safe primitive entries from an attribute bag.
 *
 * Non-primitive values (objects, arrays, `undefined`) are dropped.
 *
 * @param attributes - Raw span or log attributes.
 */
export function collectTelemetryPrimitives(
  attributes: Record<string, unknown>,
): Record<string, boolean | number | string> {
  const result: Record<string, boolean | number | string> = {}
  for (const [key, value] of Object.entries(attributes))
    if (isTelemetryPrimitive(value)) result[key] = value

  return result
}

/**
 * Decode an `AbortSignal` from an unknown value without throwing.
 *
 * @param value - Typically `request.signal` from a server function or fetch call.
 * @returns The original signal when valid; `undefined` otherwise.
 */
export const decodeAbortSignal = (value: unknown): AbortSignal | undefined =>
  Option.getOrUndefined(decodeOptional(abortSignalSchema, value))

/**
 * Decode axios error fields from an unknown caught value without throwing.
 *
 * @param value - Caught error from an axios HTTP hook.
 * @returns Typed subset when the value matches {@link axiosErrorTelemetrySchema}; `undefined` otherwise.
 */
export const decodeAxiosErrorTelemetry = (
  value: unknown,
): AxiosErrorTelemetry | undefined =>
  Option.getOrUndefined(decodeOptional(axiosErrorTelemetrySchema, value))

/**
 * Parse a request-duration header value (milliseconds) from an unknown header.
 *
 * @param header - Raw header value (expected stringified number).
 * @returns Parsed duration in ms, or `NaN` when missing or not finite.
 */
export const decodeRequestStartMs = (header: unknown): number => {
  const parsed = decodeOptional(Schema.String, header)
  if (Option.isNone(parsed)) return Number.NaN
  const duration = Number(parsed.value)
  return Number.isFinite(duration) ? duration : Number.NaN
}

/**
 * Decode a value against a schema; return `None` instead of throwing on failure.
 *
 * @param schema - Schema to decode with.
 * @param value - Unknown input.
 */
function decodeOptional<T, I, R>(
  schema: Schema.Schema<T, I, R>,
  value: unknown,
): Option.Option<T> {
  const result = Schema.decodeUnknownEither(
    schema as Schema.Schema<T, I, never>,
  )(value)
  return Either.isRight(result) ? Option.some(result.right) : Option.none()
}
