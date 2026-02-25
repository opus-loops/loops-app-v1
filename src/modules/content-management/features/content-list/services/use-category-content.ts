import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { categoryContentFn } from "./category-content-fn"

interface CategoryContentParams {
  categoryId: string
  size?: number
}

export const categoryContentQuery = (params: CategoryContentParams) =>
  queryOptions({
    queryKey: ["category-content", params.categoryId],
    queryFn: async () => {
      const response = await categoryContentFn({
        data: {
          categoryId: params.categoryId,
          size: params.size,
        },
      })
      if (response._tag === "Failure")
        throw new Error("Failed to fetch category content")
      return response.value
    },
  })

export function useCategoryContent(params: CategoryContentParams) {
  const { data } = useSuspenseQuery(categoryContentQuery(params))
  return { categoryItems: data.categoryItems }
}
