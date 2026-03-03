import {
  queryOptions,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query"
import { useEffect } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { redirect } from "@tanstack/react-router"
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
    queryFn: async () => {
      const response = await singleCategoryItemFn({
        data: {
          categoryId: params.categoryId,
          itemId: params.itemId,
        },
      })
      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        if (response.error.code === "category_not_found")
          throw redirect({ to: "/", search: { category: "all" } })
        throw new Error("Failed to fetch category item")
      }
      return response.value
    },
    queryKey: ["single-category-item", params.categoryId, params.itemId],
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
