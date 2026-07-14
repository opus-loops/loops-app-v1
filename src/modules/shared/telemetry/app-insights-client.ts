import type { ITelemetryItem } from "@microsoft/applicationinsights-web"

/**
 * Browser RUM via Application Insights JavaScript SDK.
 *
 * Server stays on OpenTelemetry + Azure Monitor. Browser uses this SDK only
 * (Microsoft-recommended split). Connection string is public — never put
 * secrets, tokens, passwords, form bodies, or PII in custom properties.
 */
import { ApplicationInsights } from "@microsoft/applicationinsights-web"
import { Predicate, Schema } from "effect"

import {
  ensureBrowserSessionId,
  getBrowserSessionId,
} from "./browser-session-client"
import { isBrowserRuntime } from "./runtime"

declare global {
  var __LOOPS_BROWSER_APP_INSIGHTS__: ApplicationInsights | undefined
}

const isString = Schema.is(Schema.String)
const isUnknownArray = Schema.is(Schema.Array(Schema.Unknown))
/** Mutable plain object — `Schema.Record` narrows to readonly indexes. */
const plainObjectSchema = Schema.filter(
  (value: unknown): value is Record<string, unknown> =>
    Predicate.isRecord(value) && !isUnknownArray(value),
)(Schema.Unknown)
const isPlainObject = Schema.is(plainObjectSchema)

const INSTRUMENTATION_KEY_PATTERN =
  /InstrumentationKey=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i

const REDACTED = "[REDACTED]"

const SENSITIVE_PROPERTY_KEY =
  /^(authorization|cookie|set-cookie|password|passwd|secret|token|access[_-]?token|refresh[_-]?token|api[_-]?key|session|ssn|email|phone|credit[_-]?card|form|body|payload)$/i

const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g

/** Query params stripped from URLs before export (SDK + custom scrub). */
export const BROWSER_REDACT_QUERY_PARAMS = [
  "token",
  "access_token",
  "refresh_token",
  "id_token",
  "password",
  "passwd",
  "secret",
  "code",
  "email",
  "authorization",
  "auth",
  "session",
  "api_key",
  "apikey",
  "sig",
  "signature",
] as const

export type BrowserTelemetryConfig = {
  connectionString: string | undefined
  enabled: boolean
}

/** Subset of Vite env used for public browser RUM. */
export type BrowserTelemetryEnv = {
  VITE_APPLICATIONINSIGHTS_CONNECTION_STRING?: string
  VITE_TELEMETRY_ENABLED?: string
}

/** Read Vite-public browser telemetry env (connection string is not a secret). */
export function readBrowserTelemetryConfig(
  env: BrowserTelemetryEnv = import.meta.env,
): BrowserTelemetryConfig {
  const enabled = env.VITE_TELEMETRY_ENABLED === "true"
  const raw = env.VITE_APPLICATIONINSIGHTS_CONNECTION_STRING?.trim()
  const connectionString =
    raw && INSTRUMENTATION_KEY_PATTERN.test(raw) ? raw : undefined
  return { connectionString, enabled }
}

/** Scrub bearer tokens, JWTs, and emails from a string. */
export function scrubBrowserTelemetryString(value: string): string {
  return value
    .replace(BEARER_PATTERN, `Bearer ${REDACTED}`)
    .replace(JWT_PATTERN, REDACTED)
    .replace(EMAIL_PATTERN, REDACTED)
}

/** Deep-scrub custom properties / nested bags before export. */
export function scrubBrowserTelemetryValue(value: unknown): unknown {
  if (isString(value)) return scrubBrowserTelemetryString(value)
  if (isUnknownArray(value)) return value.map(scrubBrowserTelemetryValue)
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [
        key,
        SENSITIVE_PROPERTY_KEY.test(key)
          ? REDACTED
          : scrubBrowserTelemetryValue(nested),
      ]),
    )
  }
  return value
}

function applyPrivacyInitializer(item: ITelemetryItem): boolean {
  const sessionId = getBrowserSessionId() ?? ensureBrowserSessionId()

  if (isPlainObject(item.baseData)) {
    const base = item.baseData
    if (isString(base.uri))
      base.uri = scrubBrowserTelemetryString(stripSensitiveQuery(base.uri))

    if (isString(base.refUri))
      base.refUri = scrubBrowserTelemetryString(
        stripSensitiveQuery(base.refUri),
      )

    if (isString(base.name)) base.name = scrubBrowserTelemetryString(base.name)

    if (isPlainObject(base.properties))
      base.properties = scrubBrowserTelemetryValue(base.properties)
  }

  const data = isPlainObject(item.data) ? item.data : {}
  const scrubbed = scrubBrowserTelemetryValue(data)
  const nextData = isPlainObject(scrubbed) ? scrubbed : {}
  nextData["browser.session.id"] = sessionId
  item.data = nextData

  return true
}

const REDACT_QUERY_PATTERN =
  /([?&])(token|access_token|refresh_token|id_token|password|passwd|secret|code|email|authorization|auth|session|api_key|apikey|sig|signature)=[^&#]*/gi

/** Active browser SDK instance, if started. */
export function getBrowserAppInsights(): ApplicationInsights | undefined {
  return globalThis.__LOOPS_BROWSER_APP_INSIGHTS__
}

/**
 * Start browser RUM once per tab when `VITE_TELEMETRY_ENABLED=true` and a
 * valid public connection string is set. Safe to call from shared router boot.
 */
export function installBrowserTelemetry(): void {
  if (!isBrowserRuntime()) return
  if (globalThis.__LOOPS_BROWSER_APP_INSIGHTS__) return

  const { connectionString, enabled } = readBrowserTelemetryConfig()
  if (!enabled || !connectionString) return

  ensureBrowserSessionId()
  globalThis.__LOOPS_BROWSER_APP_INSIGHTS__ = startAppInsights(connectionString)
}

/**
 * Track a custom client event. Properties are scrubbed; do not pass passwords,
 * tokens, form contents, or PII.
 */
export function trackBrowserEvent(
  name: string,
  properties?: Record<string, boolean | number | string>,
): void {
  const appInsights = getBrowserAppInsights()
  if (!appInsights) return

  if (properties)
    return appInsights.trackEvent(
      { name },
      scrubBrowserTelemetryValue(properties) as Record<
        string,
        boolean | number | string
      >,
    )

  appInsights.trackEvent({ name })
}

function startAppInsights(connectionString: string): ApplicationInsights {
  const appInsights = new ApplicationInsights({
    config: {
      autoTrackPageVisitTime: true,
      connectionString,
      // SPA navigations (TanStack Router history API)
      enableAutoRouteTracking: true,
      // Avoid injecting traceparent onto cross-origin API (CORS breakage risk)
      enableCorsCorrelation: false,
      // Never auto-capture auth / cookie headers
      enableRequestHeaderTracking: false,
      enableResponseHeaderTracking: false,
      enableUnhandledPromiseRejectionTracking: true,
      excludeRequestFromAutoTrackingPatterns: [
        /dc\.services\.visualstudio\.com/i,
        /in\.applicationinsights\.azure\.com/i,
        /\.livediagnostics\.monitor\.azure\.com/i,
      ],
      redactQueryParams: [...BROWSER_REDACT_QUERY_PARAMS],
    },
  })

  appInsights.addTelemetryInitializer(applyPrivacyInitializer)
  appInsights.loadAppInsights()
  appInsights.trackPageView()
  return appInsights
}

function stripSensitiveQuery(url: string): string {
  return url.replace(REDACT_QUERY_PATTERN, `$1$2=${REDACTED}`)
}
