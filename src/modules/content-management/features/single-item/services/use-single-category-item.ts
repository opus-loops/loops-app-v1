import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useEffect } from "react"
import { singleCategoryItemFn } from "./single-category-item-fn"

interface SingleCategoryItemParams {
  categoryId: string
  itemId: string
}

export const singleCategoryItemQuery = (
  params: SingleCategoryItemParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryKey: ["single-category-item", params.categoryId, params.itemId],
    queryFn: async () => {
      const response = await singleCategoryItemFn({
        data: {
          categoryId: params.categoryId,
          itemId: params.itemId,
        },
      })
      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch category item")
      }
      return response.value
    },
  })

export function useSingleCategoryItem(params: SingleCategoryItemParams) {
  const queryClient = useQueryClient()
  const { handleSessionExpired } = useGlobalError()

  const { data } = useSuspenseQuery(
    singleCategoryItemQuery(params, handleSessionExpired),
  )

  useEffect(() => {
    if (!data?.categoryItem) return
    queryClient.setQueryData(
      ["category-content"],
      (old: Array<CategoryContentItem> | undefined) => {
        if (!old) return old
        return old.map((item) =>
          item.itemId === params.itemId
            ? { ...item, categoryItem: data.categoryItem }
            : item,
        )
      },
    )
  }, [data?.categoryItem, params.itemId, queryClient])

  return { categoryItem: data.categoryItem }
}
