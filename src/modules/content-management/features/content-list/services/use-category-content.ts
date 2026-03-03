import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { categoryContentFn } from "./category-content-fn"

interface CategoryContentParams {
  categoryId: string
  size?: number
}

export const categoryContentQuery = (
  params: CategoryContentParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryKey: ["category-content", params.categoryId],
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
  })

export function useCategoryContent(params: CategoryContentParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    categoryContentQuery(params, handleSessionExpired),
  )
  return { categoryItems: data.categoryItems }
}
