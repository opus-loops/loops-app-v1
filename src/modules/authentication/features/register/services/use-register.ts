import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useCallPathSegment } from "@/modules/shared/telemetry/use-call-path-segment"

import { registerFn } from "./register-fn"

export function useRegister() {
  useCallPathSegment("hook", "useRegister")

  const registerUser = useServerFn(registerFn)

  const handleRegister = useCallback(
    async (
      email: string,
      fullName: string,
      password: string,
      phoneNumber: string,
      username: string,
    ) => {
      return await registerUser({
        data: {
          email,
          fullName,
          password,
          phoneNumber,
          username,
        },
      })
    },
    [registerUser],
  )

  return { handleRegister }
}
