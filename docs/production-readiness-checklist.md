# Production Readiness Checklist

This checklist captures the minimum release gates for the TanStack Start app.

Aligned with [TanStack Start Observability](https://tanstack.com/start/v0/docs/framework/react/guide/observability) (OpenTelemetry experimental pattern, performance checklist, security considerations). Partner Sentry examples in that guide are **not** used — this app uses **server-only Azure Monitor OpenTelemetry**.

**Observability reference:** [telemetry-reference.md](./telemetry-reference.md)

## Required Environment Variables

- `VITE_API_URL`: Public API base URL used by the client and server functions.
- `SESSION_SECRET_KEY`: Server-only session signing key.
- `VITE_GOOGLE_CLIENT_ID`: Required only when Google Sign-In is enabled.

Note: `VITE_SESSION_SECRET_KEY` is still accepted as a legacy fallback for existing environments, but new deployments should use `SESSION_SECRET_KEY`.

## Optional Telemetry Environment Variables (server-only)

- `TELEMETRY_ENABLED`: Global kill switch (`true` / `false`). Default `false`.
- `TELEMETRY_LOG_LEVEL`: `trace` | `debug` | `info` | `warn` | `error` | `fatal`.
- `APPLICATIONINSIGHTS_CONNECTION_STRING`: **Required in development and production** when telemetry is enabled.
- `OTEL_SERVICE_NAME`: Resource service name (default `loops-app`).
- `TELEMETRY_TRACES_SAMPLE_RATE`: Trace sampling ratio (`0`–`1`).

Never prefix telemetry credentials with `VITE_`. Telemetry packages and secrets must stay server-only.

## Performance Monitoring Checklist

From TanStack Start observability guide — how this repo maps:

| Checklist item              | Status  | Implementation                                                                                                  |
| --------------------------- | ------- | --------------------------------------------------------------------------------------------------------------- |
| Server function performance | Partial | No per-`/_serverFn` spans (noise). Unexpected `UnknownError` / defects only via `handleServerFnFailure`.        |
| Route loading times         | Pass    | UI page routes only (`isPageRoute`): spans `METHOD /path` with `http.method`, `http.route`, `http.status_code`. |
| Database query performance  | N/A     | No app database; backend is external API.                                                                       |
| External API latency        | Pass    | Axios interceptors: dependency duration, 5xx/network errors, timeouts, correlation/`traceparent`.               |
| Memory usage                | Pass    | `/health` and `/ready` expose `uptime` and `memory.rss` (no console logging).                                   |
| Error rates                 | Pass    | Metrics/span errors for **5xx** and infrastructure failures only — not logical **4xx** / domain codes.          |

## Security Considerations

From TanStack Start observability guide:

| Consideration                                     | Status  | Implementation                                                                                  |
| ------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------- |
| Never log sensitive data (passwords, tokens, PII) | Pass    | `redact.ts` on span attributes/events; no full URLs/query strings (`http.route` pathname only). |
| Structured logging                                | Pass    | Span events + Azure Monitor exporters (no server `console.*` from telemetry).                   |
| Log rotation in production                        | N/A     | Handled by Azure Monitor retention, not local files.                                            |
| Compliance (GDPR, CCPA)                           | Partial | Redaction + no client telemetry; review App Insights retention/access in Azure.                 |

Additional app rules:

- Instrument **UI page routes only** (`/auth`, `/explore`, …). Exclude `/_serverFn/*`, static assets, source maps, `/.well-known/*`, probes.
- Record exceptions for **`UnknownError` / defects** only — not domain failures like `Unauthorized`.

## Release Gates

- Build passes with `pnpm build`.
- Required environment variables are present in the target environment.
- Session signing key is configured with `SESSION_SECRET_KEY`.
- Staging deployment can pull or build the target image successfully.
- Browser-only development tools are excluded from the production bundle.
- Azure Monitor connection string and sampling are explicitly configured for the target environment.
- Security headers are configured at the edge or app server.
- A health or readiness probe is available for the deployed service.
- Critical user flows have automated test coverage.
- Deployment and rollback steps are documented for the team.

## Current Repository Status

- Pass: Build succeeds locally with `pnpm build`.
- Pass: Server startup now fails fast when the session secret is missing.
- Pass: Client devtools load only in development and no longer ship in the main production bundle.
- Pass: Server-only Azure Monitor OpenTelemetry replaces Sentry (TanStack partner Sentry path not used).
- Pass: Telemetry is disabled unless `TELEMETRY_ENABLED=true` and configuration is valid.
- Pass: `/health` and `/ready` include uptime/memory/telemetry status.
- Pass: Baseline security headers are applied by the application server, with CSP and HSTS enabled in production.
- Pending: The current production build still emits large client chunks, including a main bundle above 500 kB.

## Recommended Production Defaults

- `TELEMETRY_ENABLED=true`
- `APPLICATIONINSIGHTS_CONNECTION_STRING=<your-app-insights-connection-string>`
- `TELEMETRY_LOG_LEVEL=info`
- `TELEMETRY_TRACES_SAMPLE_RATE=0.1`
- `OTEL_SERVICE_NAME=loops-app`

## Verification Commands

```bash
pnpm typecheck
pnpm build
bash -n scripts/deploy-staging.sh
rg -i "applicationinsights|@azure/monitor|opentelemetry|useAzureMonitor|__LOOPS_TELEMETRY__|sentry" .output/public || true
```
