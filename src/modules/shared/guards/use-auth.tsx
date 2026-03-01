import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"
import { isAuthenticated } from "./is-authenticated"

export const authenticatedQuery = queryOptions({
  queryFn: async () => {
    const response = await isAuthenticated()
    if (response._tag === "Failure") throw redirect({ to: "/login" })
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
