import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { LoginWire } from "./login-fn"
import { loginFn } from "./login-fn"

export function useLogin() {
  const logUser = useServerFn(loginFn)
  const router = useRouter()

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      // Call server function → returns JSON-safe union
      const response = (await logUser({
        data: { password, username },
      })) as LoginWire

      // No runtime decode on client. If you still want runtime checks,
      // you can add a tiny inline type guard here.
      if (response._tag === "Success") {
        await router.navigate({ to: "/" })
      }

      return response
    },
    [logUser, router],
  )

  return { handleLogin }
}
