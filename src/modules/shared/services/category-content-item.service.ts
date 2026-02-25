import { singleCategoryItemFn } from "@/modules/content-management/features/single-item/services/single-category-item-fn"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { Effect } from "effect"

export interface GetCategoryContentItemByIdParams {
  categoryId: string
  itemId: string
}

export interface CategoryContentItemServiceError {
  _tag: "CategoryContentItemServiceError"
  code: string
  message: string
}

export const createCategoryContentItemServiceError = (params: {
  code: string
  message: string
}): CategoryContentItemServiceError => ({
  _tag: "CategoryContentItemServiceError",
  code: params.code,
  message: params.message,
})

/**
 * Fetches a category content item by its ID using the server function
 */
export function getCategoryContentItemById(
  params: GetCategoryContentItemByIdParams,
): Effect.Effect<CategoryContentItem, CategoryContentItemServiceError> {
  return Effect.tryPromise({
    try: async () => {
      const response = await singleCategoryItemFn({
        data: {
          categoryId: params.categoryId,
          itemId: params.itemId,
        },
      })

      if (response._tag === "Failure")
        throw new Error("Failed to fetch category item")

      return response.value.categoryItem
    },
    catch: (error) => {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred"
      return createCategoryContentItemServiceError({
        code: "FETCH_ERROR",
        message,
      })
    },
  })
}
