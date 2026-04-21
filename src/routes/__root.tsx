/// <reference types="vite/client" />
import "@/lib/i18n"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useServerFn } from "@tanstack/react-start"
import { useEffect } from "react"
import { getI18n, useTranslation } from "react-i18next"

import type { RouterContext } from "@/router"

import { updatePreferencesFn } from "@/modules/profile/services/update-preferences-fn"
import { GlobalErrorComponent } from "@/modules/shared/components/common/global-error-component"
import { Toaster } from "@/modules/shared/components/ui/sonner"
import { isAuthenticated } from "@/modules/shared/guards/is-authenticated"
import { deletePendingLanguageFn } from "@/modules/shared/shell/first_install/services/delete-pending-language-fn"
import { getPendingLanguageFn } from "@/modules/shared/shell/first_install/services/get-pending-language-fn"
import { GlobalErrorProvider } from "@/modules/shared/shell/session/global-error-provider"
import { SessionExpiredDialog } from "@/modules/shared/shell/session/session-expired-dialog"
import { setUserTimezoneFn } from "@/modules/shared/shell/session/set-user-timezone-fn"

import appCss from "../styles/app.css?url"

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    const i18n = getI18n()
    const auth = await isAuthenticated()
    const pendingLanguage = await getPendingLanguageFn()

    if (auth._tag === "Success" && auth.value.user !== null) {
      if (pendingLanguage) {
        await updatePreferencesFn({
          data: { language: pendingLanguage },
        })

        await deletePendingLanguageFn()
        return
      }

      const language = auth.value.user.language
      i18n.changeLanguage(language)
    }
  },
  component: function RootComponent() {
    const { i18n } = useTranslation()
    const dir = i18n.dir()
    const setUserTimezone = useServerFn(setUserTimezoneFn)

    useEffect(() => {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (timezone) void setUserTimezone({ data: { timezone } })
    }, [setUserTimezone])

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
                  position={dir === "rtl" ? "bottom-left" : "bottom-right"}
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
  errorComponent: GlobalErrorComponent,
  head: () => ({
    links: [
      { href: appCss, rel: "stylesheet" },
      { href: "/favicon.png", rel: "icon", type: "image/png" },
    ],
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
