/**
 * Alternate TanStack Start server entry (async fetch) with request instrumentation.
 *
 * Same telemetry wrapper as {@link ./server.ts}; used by the SSR build pipeline.
 */
import handler, { createServerEntry } from "@tanstack/react-start/server-entry"

import { handleInstrumentedRequest } from "@/server/telemetry/request"

export default createServerEntry({
  async fetch(request: Request) {
    return handleInstrumentedRequest(request, (req) => handler.fetch(req))
  },
})
