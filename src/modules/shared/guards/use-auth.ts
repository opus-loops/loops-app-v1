import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"

import { sessionCleanupFn } from "../shell/session/session-cleanup-fn"
import { isAuthenticated } from "./is-authenticated"

export const authenticatedQuery = queryOptions({
  queryFn: async () => {
    const response = await isAuthenticated()

    if (response._tag === "Failure" || response.value.user === null)
      throw redirect({ to: "/auth" })

    if (response.value.user.role !== "user") {
      await sessionCleanupFn()
      throw redirect({ to: "/auth" })
    }
    return { user: response.value.user }
  },
  queryKey: ["authenticated"],
})

export function useAuth() {
  const {
    data: { user },
  } = useSuspenseQuery(authenticatedQuery)

  return { user }
}
