import { createServerFn } from "@tanstack/react-start"
import { setCookie } from "@tanstack/react-start/server"

export const setUserTimezoneFn = createServerFn({ method: "POST" })
  .inputValidator((data: { timezone: string }) => data)
  .handler(async ({ data }) => {
    const expiredAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

    setCookie("user_timezone", data.timezone, {
      expires: expiredAt,
      httpOnly: false,
      path: "/",
      sameSite: "lax",
      secure: true,
    })
  })
