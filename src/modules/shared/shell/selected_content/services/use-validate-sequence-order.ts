import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type {
  ValidateSequenceOrderArgs,
  ValidateSequenceOrderWire,
} from "./validate-sequence-order-fn"
import { validateSequenceOrderFn } from "./validate-sequence-order-fn"

export function useValidateSequenceOrder() {
  const queryClient = useQueryClient()
  const validateSequenceOrder = useServerFn(validateSequenceOrderFn)

  const handleValidateSequenceOrder = useCallback(
    async (args: ValidateSequenceOrderArgs) => {
      // Call server function → returns JSON-safe union
      const response = (await validateSequenceOrder({
        data: args,
      })) as ValidateSequenceOrderWire

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: [
            "sub-quiz-content",
            args.categoryId,
            args.quizId,
            args.questionId,
          ],
        })
      }

      return response
    },
    [validateSequenceOrder, queryClient],
  )

  return { handleValidateSequenceOrder }
}
