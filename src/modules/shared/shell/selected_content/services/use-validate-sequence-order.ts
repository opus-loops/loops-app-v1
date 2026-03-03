import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "../../session/global-error-provider"
import { validateSequenceOrderFn } from "./validate-sequence-order-fn"
import type {
  ValidateSequenceOrderArgs,
  ValidateSequenceOrderWire,
} from "./validate-sequence-order-fn"

export function useValidateSequenceOrder() {
  const queryClient = useQueryClient()
  const { handleSessionExpired } = useGlobalError()
  const validateSequenceOrder = useServerFn(validateSequenceOrderFn)

  const handleValidateSequenceOrder = useCallback(
    async (args: ValidateSequenceOrderArgs) => {
      const response = await validateSequenceOrder({
        data: args,
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["single-category-item", args.categoryId, args.quizId],
        })

        await queryClient.invalidateQueries({
          queryKey: ["quiz-content", args.categoryId, args.quizId],
        })
      }

      return response
    },
    [validateSequenceOrder, queryClient, handleSessionExpired],
  )

  return { handleValidateSequenceOrder }
}
