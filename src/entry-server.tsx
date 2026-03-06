import {
  captureException,
  wrapFetchWithSentry,
} from "@sentry/tanstackstart-react"
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

export default createServerEntry(
  wrapFetchWithSentry({
    async fetch(request: Request) {
      try {
        return await handler.fetch(request)
      } catch (error) {
        captureException(error)
        throw error
      }
    },
  }),
)
