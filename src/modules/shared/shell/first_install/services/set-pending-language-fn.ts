import { createServerFn } from "@tanstack/react-start"
import { setCookie } from "@tanstack/react-start/server"
import { PENDING_LANGUAGE_KEY } from "../constants"

export const setPendingLanguageFn = createServerFn({ method: "POST" })
  .inputValidator((data: { language: string }) => data)
  .handler(async ({ data }) => {
    const expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    setCookie(PENDING_LANGUAGE_KEY, data.language, {
      httpOnly: true,
      path: "/",
      expires: expiredAt,
      sameSite: "lax",
    })
    return { success: true }
  })
