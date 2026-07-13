import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
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
    return null
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})
