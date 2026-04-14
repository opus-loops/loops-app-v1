import { parseBooleanEnv, parseNumberEnv } from "./env-utils"

function readOptionalServerEnv(...names: Array<string>) {
  for (const name of names) {
    const value = process.env[name]

    if (!value) continue

    const trimmedValue = value.trim()

    if (trimmedValue !== "") return trimmedValue
  }

  return undefined
}

function readRequiredServerEnv(
  primaryName: string,
  ...fallbackNames: Array<string>
) {
  const value = readOptionalServerEnv(primaryName, ...fallbackNames)

  if (!value) {
    const acceptedNames = [primaryName, ...fallbackNames].join(" or ")
    throw new Error(
      `Missing required server environment variable: ${acceptedNames}`,
    )
  }

  return value
}

const defaultTracesSampleRate = process.env.NODE_ENV === "production" ? 0.1 : 1

export const serverEnv = {
  sentry: {
    dsn: readOptionalServerEnv("SENTRY_DSN", "VITE_SENTRY_DSN"),
    enableLogs: parseBooleanEnv(process.env.SENTRY_ENABLE_LOGS, false),
    sendDefaultPii: parseBooleanEnv(process.env.SENTRY_SEND_DEFAULT_PII, false),
    tracesSampleRate: parseNumberEnv(
      process.env.SENTRY_TRACES_SAMPLE_RATE,
      defaultTracesSampleRate,
    ),
  },
  sessionSecretKey: readRequiredServerEnv(
    "SESSION_SECRET_KEY",
    "VITE_SESSION_SECRET_KEY",
  ),
}

export function assertServerEnv() {
  return serverEnv
}
