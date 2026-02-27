import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { exploreCategoriesFn } from "./explore-categories-fn"

export const exploreCategoriesQuery = queryOptions({
  queryFn: async () => {
    const response = await exploreCategoriesFn()
    if (response._tag === "Failure")
      throw new Error("Failed to fetch explore categories")

    return response.value
  },
  queryKey: ["explore-categories"],
})

export function useExploreCategories() {
  const {
    data: { categories },
  } = useSuspenseQuery(exploreCategoriesQuery)
  return { categories }
}
