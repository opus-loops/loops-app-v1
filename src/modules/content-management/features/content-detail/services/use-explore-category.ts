import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"

import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

import { exploreCategoryFn } from "./explore-category-fn"

interface ExploreCategoryParams {
  categoryId: string
}

export const exploreCategoryQuery = (
  params: ExploreCategoryParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await exploreCategoryFn({
        data: { categoryId: params.categoryId },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch explore category")
      }

      const { category } = response.value

      if (category === null) {
        throw redirect({
          search: { category: "all" },
          to: "/",
        })
      }

      return { category }
    },
    queryKey: ["explore-category", params.categoryId],
  })

export function useExploreCategory(params: ExploreCategoryParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    exploreCategoryQuery(params, handleSessionExpired),
  )
  return {
    category: data.category,
    certificate: data.category.certificate,
  }
}
