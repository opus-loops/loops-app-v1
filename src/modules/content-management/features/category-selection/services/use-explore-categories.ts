import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { exploreCategoriesFn } from "./explore-categories-fn"
import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

export const exploreCategoriesQuery = (
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await exploreCategoriesFn()
      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch explore categories")
      }

      return response.value
    },
    queryKey: ["explore-categories"],
  })

export function useExploreCategories() {
  const { handleSessionExpired } = useGlobalError()
  const {
    data: { categories },
  } = useSuspenseQuery(exploreCategoriesQuery(handleSessionExpired))
  return { categories }
}
