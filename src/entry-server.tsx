import {
  captureException,
  wrapFetchWithSentry,
} from "@sentry/tanstackstart-react"
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

import { assertServerEnv } from "@/lib/server-env"
import { handleAppRequest } from "@/lib/server-response"

assertServerEnv()

export default createServerEntry(
  wrapFetchWithSentry({
    async fetch(request: Request) {
      try {
        return await handleAppRequest(request, handler.fetch)
      } catch (error) {
        captureException(error)
        throw error
      }
    },
  }),
)
