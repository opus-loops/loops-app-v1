import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { confirmResetPasswordFn } from "./confirm-reset-password-fn"

export function useConfirmResetPassword() {
  const confirmResetPassword = useServerFn(confirmResetPasswordFn)

  const handleConfirmResetPassword = useCallback(
    async ({
      confirmationCode,
      confirmPassword,
      email,
      password,
    }: {
      confirmationCode: number
      confirmPassword: string
      email: string
      password: string
    }) => {
      return confirmResetPassword({
        data: {
          confirmationCode,
          confirmPassword,
          email,
          password,
        },
      })
    },
    [confirmResetPassword],
  )

  return { handleConfirmResetPassword }
}
