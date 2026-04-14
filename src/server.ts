import { wrapFetchWithSentry } from "@sentry/tanstackstart-react"
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

import { assertServerEnv } from "@/lib/server-env"
import { handleAppRequest } from "@/lib/server-response"

assertServerEnv()

export default createServerEntry(
  wrapFetchWithSentry({
    fetch(request: Request) {
      return handleAppRequest(request, handler.fetch)
    },
  }),
)
