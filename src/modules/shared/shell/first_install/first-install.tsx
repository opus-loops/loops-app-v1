import type { ReactNode } from "react"

import { useCallback, useEffect, useState } from "react"

import { LoadingScreen } from "@/modules/shared/components/common/loading-screen"

import { LanguageSelectionScreen } from "./language-selection-screen"
import { getPendingLanguageFn } from "./services/get-pending-language-fn"
import { WelcomeScreen } from "./welcome-screen"

const FIRST_INSTALL_KEY = "isFirstInstall"

type FirstInstallShellProps = { target: ReactNode }

export function FirstInstallShell({ target }: FirstInstallShellProps) {
  const [isFirstInstall, setIsFirstInstall] = useState<boolean | null>(null)
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState<
    boolean | null
  >(null)

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    )
      return

    const stored = localStorage.getItem(FIRST_INSTALL_KEY)
    setIsFirstInstall(stored !== "false")

    getPendingLanguageFn().then((storedLanguage) => {
      setHasSelectedLanguage(Boolean(storedLanguage))
    })
  }, [])

  const markAsNotFirstInstall = useCallback(() => {
    if (
      typeof window === "undefined" ||
      typeof window.localStorage === "undefined"
    )
      return

    localStorage.setItem(FIRST_INSTALL_KEY, "false")
    setIsFirstInstall(false)
  }, [])

  const handleLanguageSelection = useCallback(() => {
    setHasSelectedLanguage(true)
  }, [])

  if (isFirstInstall === null || hasSelectedLanguage === null)
    return <LoadingScreen />
  if (isFirstInstall && !hasSelectedLanguage)
    return <LanguageSelectionScreen onComplete={handleLanguageSelection} />
  if (isFirstInstall)
    return <WelcomeScreen skipHandler={markAsNotFirstInstall} />
  return target
}
