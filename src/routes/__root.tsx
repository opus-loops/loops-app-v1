/// <reference types="vite/client" />
import "@/lib/i18n"
import { useQuery } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"

import appCss from "../styles/app.css?url"
import type { RouterContext } from "@/router"

import { useUpdatePreferences } from "@/modules/profile/hooks/use-update-preferences"
import { Toaster } from "@/modules/shared/components/ui/sonner"
import { authenticatedQuery } from "@/modules/shared/guards/use-auth"
import { PENDING_LANGUAGE_KEY } from "@/modules/shared/shell/first_install/language-selection-screen"
import { GlobalErrorProvider } from "@/modules/shared/shell/session/global-error-provider"
import { SessionExpiredDialog } from "@/modules/shared/shell/session/session-expired-dialog"

export const Route = createRootRouteWithContext<RouterContext>()({
  component: function RootComponent() {
    const { i18n } = useTranslation()
    const { data: authData } = useQuery({
      ...authenticatedQuery,
      enabled: false,
    })
    const { handleUpdatePreferences } = useUpdatePreferences()
    const hasSyncedLanguageRef = useRef(false)

    useEffect(() => {
      const preferred = authData?.user.language
      if (preferred && i18n.language !== preferred) {
        void i18n.changeLanguage(preferred)
      }
    }, [authData?.user.language, i18n])

    useEffect(() => {
      if (hasSyncedLanguageRef.current) return
      if (
        typeof window === "undefined" ||
        typeof window.localStorage === "undefined"
      )
        return

      const stored = localStorage.getItem(PENDING_LANGUAGE_KEY)
      if (stored !== "en" && stored !== "fr" && stored !== "ar") return
      if (!authData?.user) return

      hasSyncedLanguageRef.current = true

      void (async () => {
        if (i18n.language !== stored) await i18n.changeLanguage(stored)
        const response = await handleUpdatePreferences({ language: stored })

        if (response._tag === "Success")
          localStorage.removeItem(PENDING_LANGUAGE_KEY)
        else hasSyncedLanguageRef.current = false
      })()
    }, [authData?.user, handleUpdatePreferences, i18n])

    const dir = i18n.dir()

    return (
      <html dir={dir} lang={i18n.language}>
        <head>
          <HeadContent />
        </head>
        <body>
          <GlobalErrorProvider>
            {({ handleCloseDialog, showSessionExpiredDialog }) => (
              <>
                <SessionExpiredDialog
                  isOpen={showSessionExpiredDialog}
                  onClose={handleCloseDialog}
                />

                <div className="bg-loops-background w-full">
                  <div className="relative mx-auto w-full overflow-x-hidden sm:max-w-[425px]">
                    <Outlet />
                  </div>
                </div>
                <Toaster
                  closeButton={true}
                  expand={false}
                  position="bottom-right"
                  richColors={false}
                  toastOptions={{
                    style: {
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                    },
                  }}
                />
              </>
            )}
          </GlobalErrorProvider>
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
    scripts: [
      {
        async: true,
        defer: true,
        src: "https://accounts.google.com/gsi/client",
      },
    ],
  }),
})
