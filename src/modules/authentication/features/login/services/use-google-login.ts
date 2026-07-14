import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { getSafeRedirectPath } from "@/modules/authentication/lib/auth-search"

import { googleLoginFn } from "./google-login-fn"

export function useGoogleLogin() {
  const logUser = useServerFn(googleLoginFn)
  const router = useRouter()

  const handleGoogleLogin = useCallback(
    async (accessToken: string, redirectTo?: string) => {
      // Call server function → returns JSON-safe union
      const response = await logUser({
        data: { accessToken },
      })

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

  return { handleGoogleLogin }
}
