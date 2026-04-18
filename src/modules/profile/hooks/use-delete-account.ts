import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { sessionCleanupFn } from "@/modules/shared/shell/session/session-cleanup-fn"

import { deleteAccountFn } from "../services/delete-account-fn"

export function useDeleteAccount() {
  const cleanupSession = useServerFn(sessionCleanupFn)
  const runDeleteAccount = useServerFn(deleteAccountFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleDeleteAccount = useCallback(
    async (reason?: string) => {
      const response = await runDeleteAccount({
        data: { reason },
      })

      if (
        response._tag === "Failure" &&
        response.error.code === "Unauthorized"
      ) {
        await handleSessionExpired()
      }

      if (response._tag === "Success") {
        queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })
        router.navigate({ to: "/login" })
      }

      return response
    },
    [
      cleanupSession,
      handleSessionExpired,
      queryClient,
      router,
      runDeleteAccount,
    ],
  )

  return { handleDeleteAccount }
}
