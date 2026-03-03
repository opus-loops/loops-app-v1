import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { updateCurrentCategoryFn } from "../services/update-current-category-fn"

export function useUpdateCurrentCategory() {
  const runUpdateCurrentCategory = useServerFn(updateCurrentCategoryFn)
  const queryClient = useQueryClient()
  const { handleSessionExpired } = useGlobalError()

  const handleUpdateCurrentCategory = useCallback(
    async (categoryId: string) => {
      const response = await runUpdateCurrentCategory({
        data: { categoryId },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })
      }

      return response
    },
    [runUpdateCurrentCategory, queryClient],
  )

  return { handleUpdateCurrentCategory }
}
