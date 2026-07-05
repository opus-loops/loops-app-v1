/**
 * TanStack Start instance configuration.
 *
 * Registers server-only telemetry middleware (replaces former Sentry global middleware).
 */
import { createStart } from "@tanstack/react-start"

import { telemetryFunctionMiddleware } from "@/server/telemetry/middleware"

/** Start instance with Azure Monitor server function middleware. */
export const startInstance = createStart(() => ({
  functionMiddleware: [telemetryFunctionMiddleware],
}))
