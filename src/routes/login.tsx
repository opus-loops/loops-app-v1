import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"

export const Route = createFileRoute("/login")({
  beforeLoad: ({ search }) => {
    throw redirect({
      search: buildAuthSearch("login", search.redirect),
      to: "/auth",
    })
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})
