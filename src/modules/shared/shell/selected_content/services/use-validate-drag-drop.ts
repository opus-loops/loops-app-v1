import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type {
  ValidateDragDropArgs,
  ValidateDragDropWire,
} from "./validate-drag-drop-fn.server"
import { validateDragDropFn } from "./validate-drag-drop-fn.server"

export function useValidateDragDrop() {
  const queryClient = useQueryClient()
  const validateDragDrop = useServerFn(validateDragDropFn)

  const handleValidateDragDrop = useCallback(
    async (args: ValidateDragDropArgs) => {
      // Call server function → returns JSON-safe union
      const response = (await validateDragDrop({
        data: args,
      })) as ValidateDragDropWire

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
    [validateDragDrop, queryClient],
  )

  return { handleValidateDragDrop }
}
