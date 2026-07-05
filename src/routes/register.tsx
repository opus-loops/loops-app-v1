import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { TraceRegion } from "@/modules/shared/telemetry/trace-region"
import { instrumentBeforeLoad } from "@/server/telemetry/helpers"

export const Route = createFileRoute("/register")({
  beforeLoad: ({ search }) =>
    instrumentBeforeLoad("/register", () => {
      throw redirect({
        search: buildAuthSearch("register", search.redirect),
        throw: false,
        to: "/auth",
      })
    }),
  component: function RegisterRoute() {
    return (
      <TraceRegion name="Register" type="route">
        {null}
      </TraceRegion>
    )
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})
