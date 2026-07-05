/**
 * Node.js preload entry for Azure Monitor OpenTelemetry.
 *
 * Bundled to `instrument.server.mjs` via `pnpm run build:instrument` and loaded
 * with `NODE_OPTIONS='--import ./instrument.server.mjs'` before the app starts.
 *
 * Loads `.env` from cwd before telemetry init — preload runs before Vite hydrates
 * `process.env`, so server-only vars like `TELEMETRY_ENABLED` would otherwise be missing.
 */
import { existsSync } from "node:fs"
import { resolve } from "node:path"

import { startTelemetry } from "./setup"

const envPath = resolve(process.cwd(), ".env")
if (existsSync(envPath) && "loadEnvFile" in process) {
  process.loadEnvFile(envPath)
}

startTelemetry()
