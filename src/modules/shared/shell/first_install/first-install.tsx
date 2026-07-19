import type { ReactNode } from "react"

import { Effect } from "effect"
import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { LoadingScreen } from "@/modules/shared/components/common/loading-screen"
import { trackBrowserEvent } from "@/modules/shared/telemetry/app-insights-client"

import type { SupportedLanguage } from "./constants"

import { getInAppBrowserContext } from "./browser-context"
import { LanguageSelectionScreen } from "./language-selection-screen"
import { WelcomeScreen } from "./welcome-screen"

const FIRST_INSTALL_KEY = "isFirstInstall"

declare global {
  interface Window {
    __LOOPS_FIRST_INSTALL_COMPLETED__?: boolean
  }
}

type FirstInstallShellProps = {
  pendingLanguage?: SupportedLanguage | undefined
  target: ReactNode
}

export function FirstInstallShell({
  pendingLanguage,
  target,
}: FirstInstallShellProps) {
  const { i18n } = useTranslation()
  const [isFirstInstall, setIsFirstInstall] = useState(true)
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(
    pendingLanguage !== undefined,
  )

  const [isSetupComplete, setIsSetupComplete] = useState(false)

  useEffect(() => {
    let isActive = true

    const setupFirstInstall = async () => {
      if (pendingLanguage)
        await i18n.changeLanguage(pendingLanguage).catch(() => undefined)

      if (!isActive) return

      const browserContext = getInAppBrowserContext()

      if (window.__LOOPS_FIRST_INSTALL_COMPLETED__ === true) {
        setIsFirstInstall(false)
        trackBrowserEvent("first_install.storage_check", {
          browser_context: browserContext,
          outcome: "returning",
        })
        setIsSetupComplete(true)
        return
      }

      Effect.runSync(
        Effect.match(
          Effect.try(
            () => window.localStorage.getItem(FIRST_INSTALL_KEY) === "false",
          ),
          {
            onFailure: () => {
              trackBrowserEvent("first_install.storage_check", {
                browser_context: browserContext,
                outcome: "unavailable",
              })
            },
            onSuccess: (isReturning) => {
              if (isReturning) setIsFirstInstall(false)

              trackBrowserEvent("first_install.storage_check", {
                browser_context: browserContext,
                outcome: isReturning ? "returning" : "first_install",
              })
            },
          },
        ),
      )
      setIsSetupComplete(true)
    }

    void setupFirstInstall()

    return () => {
      isActive = false
    }
  }, [i18n, pendingLanguage])

  const markAsNotFirstInstall = useCallback(() => {
    window.__LOOPS_FIRST_INSTALL_COMPLETED__ = true

    Effect.runSync(
      Effect.match(
        Effect.try(() =>
          window.localStorage.setItem(FIRST_INSTALL_KEY, "false"),
        ),
        {
          onFailure: () => {
            trackBrowserEvent("first_install.storage_write_failed", {
              browser_context: getInAppBrowserContext(),
            })
          },
          onSuccess: () => undefined,
        },
      ),
    )
    setIsFirstInstall(false)
  }, [])

  const handleLanguageSelection = useCallback(() => {
    setHasSelectedLanguage(true)
  }, [])

  if (!isSetupComplete) return <LoadingScreen />
  if (isFirstInstall && !hasSelectedLanguage)
    return <LanguageSelectionScreen onComplete={handleLanguageSelection} />
  if (isFirstInstall)
    return <WelcomeScreen skipHandler={markAsNotFirstInstall} />
  return target
}
