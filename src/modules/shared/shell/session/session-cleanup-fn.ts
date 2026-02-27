import { createServerFn } from "@tanstack/react-start"
import { deleteSession } from "./session"

export const sessionCleanupFn = //
  createServerFn({ method: "POST" }) //
    .handler(() => {
      deleteSession()
    })
