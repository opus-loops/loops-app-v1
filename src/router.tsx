import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { installClientTelemetryFetch } from "@/modules/shared/telemetry/install-client-telemetry-fetch"

import type { RouterContext } from "./router-context"

import { installBrowserTelemetry } from "./modules/shared/telemetry/app-insights-client"
import {
  DefaultErrorComponent,
  DefaultNotFoundComponent,
} from "./router-defaults"
import { routeTree } from "./routeTree.gen"

export type { RouterContext } from "./router-context"

export function createRouter() {
  installClientTelemetryFetch()
  installBrowserTelemetry()
  const queryClient = new QueryClient()
  const router = createTanStackRouter({
    context: {
      queryClient,
    } satisfies RouterContext,
    defaultErrorComponent: DefaultErrorComponent,
    defaultNotFoundComponent: DefaultNotFoundComponent,
    routeTree,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  return router
}

export { createRouter as getRouter }

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
