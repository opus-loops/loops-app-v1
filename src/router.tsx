import * as Sentry from "@sentry/tanstackstart-react"
import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { routeTree } from "./routeTree.gen"

export type RouterContext = {
  queryClient: QueryClient
}

export function createRouter() {
  const queryClient = new QueryClient()
  const router = createTanStackRouter({
    context: {
      queryClient,
    } satisfies RouterContext,
    defaultNotFoundComponent: function NotFound() {
      return <h1>Page not found</h1>
    },
    routeTree,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    queryClient,
    router,
  })

  if (!router.isServer) {
    Sentry.init({
      dsn: "https://b57fbc739c7ab5e48db3d8de3fea5dd0@o4510999464378368.ingest.de.sentry.io/4510999717478480",

      // Enable logs to be sent to Sentry
      enableLogs: true,

      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration(),
      ],

      replaysOnErrorSampleRate: 1.0,

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error.
      replaysSessionSampleRate: 0.1,
      // Adds request headers and IP for users, for more info visit:
      // https://docs.sentry.io/platforms/javascript/guides/tanstackstart-react/configuration/options/#sendDefaultPii
      sendDefaultPii: true,

      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for tracing.
      // We recommend adjusting this value in production.
      // Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
      tracesSampleRate: 1.0,
    })
  }

  return router
}

export { createRouter as getRouter }

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
