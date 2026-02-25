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
        const message = "Failed to fetch explore category"
        throw new Error(message)
      }
      return response.value
    },
  })

export function useExploreCategory(params: ExploreCategoryParams) {
  const { data } = useSuspenseQuery(exploreCategoryQuery(params))
  return { category: data.category }
}
