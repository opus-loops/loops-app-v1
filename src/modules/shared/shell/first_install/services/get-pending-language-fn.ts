import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"

import { parseSupportedLanguage, PENDING_LANGUAGE_KEY } from "../constants"

export const getPendingLanguageFn = createServerFn({ method: "GET" }).handler(
  () => {
    const storedLanguage = getCookie(PENDING_LANGUAGE_KEY)
    if (storedLanguage === undefined) return undefined

    const pendingLanguage = parseSupportedLanguage(storedLanguage)
    if (!pendingLanguage) throw new Error("Invalid pending language cookie")

    return pendingLanguage
  },
)
