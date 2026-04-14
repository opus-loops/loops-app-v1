# Production Readiness Checklist

This checklist captures the minimum release gates for the TanStack Start app.

## Required Environment Variables

- `VITE_API_URL`: Public API base URL used by the client and server functions.
- `SESSION_SECRET_KEY`: Server-only session signing key.
- `VITE_GOOGLE_CLIENT_ID`: Required only when Google Sign-In is enabled.
- `VITE_SENTRY_DSN`: Optional browser Sentry DSN.
- `SENTRY_DSN`: Optional server Sentry DSN.
- `SENTRY_AUTH_TOKEN`: Optional build-time token for source map upload.

Note: `VITE_SESSION_SECRET_KEY` is still accepted as a legacy fallback for existing environments, but new deployments should use `SESSION_SECRET_KEY`.

## Release Gates

- Build passes with `pnpm build`.
- Required environment variables are present in the target environment.
- Session signing key is configured with `SESSION_SECRET_KEY`.
- Staging deployment can pull or build the target image successfully.
- Browser-only development tools are excluded from the production bundle.
- Sentry sampling and PII settings are explicitly configured for the target environment.
- Security headers are configured at the edge or app server.
- A health or readiness probe is available for the deployed service.
- Critical user flows have automated test coverage.
- Deployment and rollback steps are documented for the team.

## Current Repository Status

- Pass: Build succeeds locally with `pnpm build`.
- Pass: Server startup now fails fast when the session secret is missing.
- Pass: Client devtools load only in development and no longer ship in the main production bundle.
- Pass: Browser Sentry is loaded lazily and only when a browser DSN is configured.
- Pass: Sentry DSNs, sampling, and PII settings are now environment-driven.
- Pass: Sentry source map upload is skipped cleanly when `SENTRY_AUTH_TOKEN` is not configured.
- Pass: A `/health` endpoint is available from the application server.
- Pass: Baseline security headers are applied by the application server, with CSP and HSTS enabled in production.
- Pending: The current production build still emits large client chunks, including a main bundle above 500 kB.
- Pending: No automated test suite is present under `src/**/*.{test,spec}.*`.

## Recommended Production Defaults

- `VITE_SENTRY_ENABLE_LOGS=false`
- `VITE_SENTRY_SEND_DEFAULT_PII=false`
- `VITE_SENTRY_TRACES_SAMPLE_RATE=0.1`
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE=0`
- `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE=1`
- `SENTRY_ENABLE_LOGS=false`
- `SENTRY_SEND_DEFAULT_PII=false`
- `SENTRY_TRACES_SAMPLE_RATE=0.1`

## Verification Commands

```bash
pnpm build
bash -n scripts/deploy-staging.sh
```
