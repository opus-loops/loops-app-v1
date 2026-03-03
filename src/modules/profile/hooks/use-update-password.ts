import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { updatePasswordFn } from "../services/update-password-fn"

export function useUpdatePassword() {
  const runUpdatePassword = useServerFn(updatePasswordFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleUpdatePassword = useCallback(
    async (password: string, newPassword: string) => {
      const response = await runUpdatePassword({
        data: { password, newPassword },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })

        await router.navigate({ to: "/login" })
      }

      return response
    },
    [runUpdatePassword, queryClient, router, handleSessionExpired],
  )

  return { handleUpdatePassword }
}
