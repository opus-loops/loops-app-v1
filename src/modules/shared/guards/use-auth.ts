import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"

import { useCallPathSegment } from "../telemetry/use-call-path-segment"
import { isAuthenticated } from "./is-authenticated"

export const authenticatedQuery = queryOptions({
  queryFn: async () => {
    const response = await isAuthenticated()

    if (response._tag === "Failure" || response.value.user === null)
      throw redirect({ throw: false, to: "/auth" })

    return { user: response.value.user }
  },
  queryKey: ["authenticated"],
})

export function useAuth() {
  useCallPathSegment("hook", "useAuth")

  const {
    data: { user },
  } = useSuspenseQuery(authenticatedQuery)

  return { user }
}
