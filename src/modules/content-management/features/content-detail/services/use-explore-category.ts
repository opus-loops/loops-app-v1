import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { exploreCategoryFn } from "./explore-category-fn"

interface ExploreCategoryParams {
  categoryId: string
}

export const exploreCategoryQuery = (params: ExploreCategoryParams) =>
  queryOptions({
    queryKey: ["explore-category", params.categoryId],
    queryFn: async () => {
      const response = await exploreCategoryFn({
        data: { categoryId: params.categoryId },
      })

      if (response._tag === "Failure") {
        throw new Error("Failed to fetch explore category")
      }
      return response.value
    },
  })

export function useExploreCategory(params: ExploreCategoryParams) {
  const { data } = useSuspenseQuery(exploreCategoryQuery(params))
  return { category: data.category }
}
