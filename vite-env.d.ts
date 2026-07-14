/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  /**
   * Application Insights connection string for the browser SDK.
   * Visible in the client bundle — not a secret. Prefer a separate App Insights
   * resource if server export uses Entra ID auth only.
   */
  readonly VITE_APPLICATIONINSIGHTS_CONNECTION_STRING?: string
  readonly VITE_AUTH_MODE?: string
  readonly VITE_BFF_SESSION_COOKIE?: string
  readonly VITE_BFF_URL?: string
  readonly VITE_SESSION_SECRET_KEY?: string
  /** Public browser RUM switch (`"true"` only). Not a server secret. */
  readonly VITE_TELEMETRY_ENABLED?: string
}
