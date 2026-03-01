import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { GoogleLoginWire } from "./google-login-fn"
import { googleLoginFn } from "./google-login-fn"

export function useGoogleLogin() {
  const logUser = useServerFn(googleLoginFn)
  const router = useRouter()

  const handleGoogleLogin = useCallback(
    async (accessToken: string) => {
      // Call server function → returns JSON-safe union
      const response = (await logUser({
        data: { accessToken },
      })) as GoogleLoginWire

      if (response._tag === "Success") {
        await router.navigate({ to: "/" })
      }

      return response
    },
    [logUser, router],
  )

  return { handleGoogleLogin }
}
