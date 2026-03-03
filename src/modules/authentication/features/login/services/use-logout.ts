import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { logoutFn } from "./logout-fn"

export function useLogout() {
  const runLogout = useServerFn(logoutFn)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { handleSessionExpired } = useGlobalError()

  const handleLogout = useCallback(async () => {
    const response = await runLogout()

    if (response._tag === "Failure") {
      if (response.error.code === "Unauthorized") {
        await handleSessionExpired()
      }
    }
    if (response._tag === "Success") {
      await queryClient.invalidateQueries({ queryKey: ["authenticated"] })
      await router.navigate({ to: "/login" })
    }

    return response
  }, [runLogout, queryClient, router])

  return { handleLogout }
}
