import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { requestResetPasswordFn } from "./request-reset-password-fn"

export function useRequestResetPassword() {
  const requestResetPassword = useServerFn(requestResetPasswordFn)

  const handleRequestResetPassword = useCallback(
    async (email: string) => {
      return requestResetPassword({
        data: { email },
      })
    },
    [requestResetPassword],
  )

  return { handleRequestResetPassword }
}
