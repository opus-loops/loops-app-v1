import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

export const getLocaleFn = createServerFn({ method: "GET" }).handler(
  async () => getCookie("i18next") || "en",
)
