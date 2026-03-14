import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

import { PENDING_LANGUAGE_KEY } from "../constants"

export const getPendingLanguageFn = createServerFn({ method: "GET" }).handler(
  async () => getCookie(PENDING_LANGUAGE_KEY),
)
