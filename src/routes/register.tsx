import { createFileRoute, redirect } from "@tanstack/react-router"
import { z } from "zod"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"

export const Route = createFileRoute("/register")({
  beforeLoad: ({ search }) => {
    throw redirect({
      search: buildAuthSearch("register", search.redirect),
      to: "/auth",
    })
  },
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
})
