import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { categoryContentFn } from "./category-content-fn"
import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

interface CategoryContentParams {
  categoryId: string
  size?: number
}

export const categoryContentQuery = (
  params: CategoryContentParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await categoryContentFn({
        data: {
          categoryId: params.categoryId,
          size: params.size,
        },
      })
      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch category content")
      }
      return response.value
    },
    queryKey: ["category-content", params.categoryId],
  })

export function useCategoryContent(params: CategoryContentParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    categoryContentQuery(params, handleSessionExpired),
  )
  return { categoryItems: data.categoryItems }
}
