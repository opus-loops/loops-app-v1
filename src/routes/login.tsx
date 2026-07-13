import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { instrumentBeforeLoad } from "@/server/telemetry/helpers"

export const Route = createFileRoute("/login")({
  beforeLoad: ({ search }) =>
    instrumentBeforeLoad("/login", () => {
      throw redirect({
        search: buildAuthSearch("login", search.redirect),
        throw: false,
        to: "/auth",
      })
    }),
  component: function LoginRoute() {
    return null
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})
