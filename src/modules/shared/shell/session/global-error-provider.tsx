import { useServerFn } from "@tanstack/react-start"
import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"

import { sessionCleanupFn } from "./session-cleanup-fn"

type GlobalErrorContextType = {
  handleCloseDialog: () => void
  handleSessionExpired: () => Promise<void>
  showSessionExpiredDialog: boolean
}

const GlobalErrorContext = createContext({} as GlobalErrorContextType)

export function useGlobalError() {
  return useContext(GlobalErrorContext)
}

type GlobalErrorProviderProps = {
  children: ((props: GlobalErrorContextType) => ReactNode) | ReactNode
}

export function GlobalErrorProvider({ children }: GlobalErrorProviderProps) {
  const sessionCleanup = useServerFn(sessionCleanupFn)
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] =
    useState(false)

  const handleSessionExpired = async () => {
    await sessionCleanup()
    setShowSessionExpiredDialog(true)
  }

  const handleCloseDialog = () => {
    setShowSessionExpiredDialog(false)
  }

  return (
    <GlobalErrorContext.Provider
      value={{
        handleCloseDialog,
        handleSessionExpired,
        showSessionExpiredDialog,
      }}
    >
      {typeof children === "function"
        ? children({
            handleCloseDialog,
            handleSessionExpired,
            showSessionExpiredDialog,
          })
        : children}
    </GlobalErrorContext.Provider>
  )
}
