import { parseBooleanEnv, parseNumberEnv } from "./env-utils"

const env = import.meta.env as Record<string, boolean | string | undefined>

function readOptionalPublicEnv(name: string) {
  const value = env[name]

  if (typeof value !== "string") return undefined

  const trimmedValue = value.trim()
  return trimmedValue === "" ? undefined : trimmedValue
}

function readRequiredPublicEnv(name: string) {
  const value = readOptionalPublicEnv(name)

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const defaultTracesSampleRate = import.meta.env.PROD ? 0.1 : 1

export const publicEnv = {
  apiUrl: readRequiredPublicEnv("VITE_API_URL"),
  googleClientId: readOptionalPublicEnv("VITE_GOOGLE_CLIENT_ID"),
  sentry: {
    dsn: readOptionalPublicEnv("VITE_SENTRY_DSN"),
    enableLogs: parseBooleanEnv(
      readOptionalPublicEnv("VITE_SENTRY_ENABLE_LOGS"),
      !import.meta.env.PROD,
    ),
    replaysOnErrorSampleRate: parseNumberEnv(
      readOptionalPublicEnv("VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE"),
      1,
    ),
    replaysSessionSampleRate: parseNumberEnv(
      readOptionalPublicEnv("VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE"),
      0,
    ),
    sendDefaultPii: parseBooleanEnv(
      readOptionalPublicEnv("VITE_SENTRY_SEND_DEFAULT_PII"),
      false,
    ),
    tracesSampleRate: parseNumberEnv(
      readOptionalPublicEnv("VITE_SENTRY_TRACES_SAMPLE_RATE"),
      defaultTracesSampleRate,
    ),
  },
}
