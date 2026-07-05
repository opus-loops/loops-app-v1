/**
 * TanStack Start server entry with Azure Monitor request instrumentation.
 *
 * Replaces former `wrapFetchWithSentry`. All incoming fetches pass through
 * {@link ./server/telemetry/request.handleInstrumentedRequest}.
 */
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

import { handleInstrumentedRequest } from "@/server/telemetry/request"

export default createServerEntry({
  fetch(request: Request) {
    return handleInstrumentedRequest(request, (req) => handler.fetch(req))
  },
})
