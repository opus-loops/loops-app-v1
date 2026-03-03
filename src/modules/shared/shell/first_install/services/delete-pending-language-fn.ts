import { createServerFn } from "@tanstack/react-start"
import { deleteCookie } from "@tanstack/react-start/server"
import { PENDING_LANGUAGE_KEY } from "../constants"

export const deletePendingLanguageFn = createServerFn({
  method: "POST",
}).handler(async () => {
  deleteCookie(PENDING_LANGUAGE_KEY)
})
