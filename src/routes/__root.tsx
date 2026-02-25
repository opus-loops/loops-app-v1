/// <reference types="vite/client" />
import { Toaster } from "@/modules/shared/components/ui/sonner"
import type { RouterContext } from "@/router"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: function RootComponent() {
    return (
      <html>
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="bg-loops-background w-full">
            <div className="relative mx-auto w-full overflow-x-hidden sm:max-w-[425px]">
              <Outlet />
            </div>
          </div>
          <Toaster
            position="bottom-right"
            expand={false}
            richColors={false}
            closeButton={true}
            toastOptions={{
              style: {
                borderRadius: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: "500",
              },
            }}
          />
          {/* Dev tools - only show in development */}
          {process.env.NODE_ENV === "development" && (
            <>
              <ReactQueryDevtools initialIsOpen={false} />
              <TanStackRouterDevtools />
              <script
                crossOrigin="anonymous"
                id="react-scan"
                src="//unpkg.com/react-scan/dist/auto.global.js"
              ></script>
            </>
          )}
          <Scripts />
        </body>
      </html>
    )
  },
  head: () => ({
    links: [{ href: appCss, rel: "stylesheet" }],
    meta: [
      { charSet: "utf-8" },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Loops",
      },
    ],
  }),
})
