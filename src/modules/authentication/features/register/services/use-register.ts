import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { registerFn } from "./register-fn"

export function useRegister() {
  const registerUser = useServerFn(registerFn)
  const router = useRouter()

  const handleRegister = useCallback(
    async (
      email: string,
      fullName: string,
      password: string,
      phoneNumber: string,
      username: string,
    ) => {
      const response = await registerUser({
        data: { email, fullName, password, phoneNumber, username },
      })

      if (response._tag === "Success") {
        await router.navigate({ to: "/login" })
      }

      return response
    },
    [registerUser, router],
  )

  return { handleRegister }
}
