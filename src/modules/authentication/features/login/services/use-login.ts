import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { getSafeRedirectPath } from "@/modules/authentication/lib/auth-search"

import { loginFn } from "./login-fn"

export function useLogin() {
  const logUser = useServerFn(loginFn)
  const router = useRouter()

  const handleLogin = useCallback(
    async (username: string, password: string, redirectTo?: string) => {
      // Call server function → returns JSON-safe union
      const response = await logUser({
        data: { password, username },
      })

      // No runtime decode on client. If you still want runtime checks,
      // you can add a tiny inline type guard here.
      if (response._tag === "Success") {
        const safeRedirect = getSafeRedirectPath(redirectTo)

        if (safeRedirect) {
          window.location.assign(safeRedirect)
          return response
        }

        await router.navigate({ to: "/" })
      }

      return response
    },
    [logUser, router],
  )

  return { handleLogin }
}
