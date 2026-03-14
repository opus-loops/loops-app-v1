import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

import { startCategoryFn } from "../services/start-category-fn"

export function useStartCategory() {
  const runStartCategory = useServerFn(startCategoryFn)
  const queryClient = useQueryClient()
  const router = useRouter()
  const { handleSessionExpired } = useGlobalError()

  const handleStartCategory = useCallback(
    async (categoryId: string) => {
      const response = await runStartCategory({
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

        await router.navigate({ search: {}, to: "/" })
      }

      return response
    },
    [runStartCategory, queryClient],
  )

  return { handleStartCategory }
}
