import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type {
  ValidateChoiceQuestionArgs,
  ValidateChoiceQuestionWire,
} from "./validate-choice-question-fn"
import { validateChoiceQuestionFn } from "./validate-choice-question-fn"

export function useValidateChoiceQuestion() {
  const queryClient = useQueryClient()
  const validateChoiceQuestion = useServerFn(validateChoiceQuestionFn)

  const handleValidateChoiceQuestion = useCallback(
    async (args: ValidateChoiceQuestionArgs) => {
      // Call server function → returns JSON-safe union
      const response = (await validateChoiceQuestion({
        data: args,
      })) as ValidateChoiceQuestionWire

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
    [validateChoiceQuestion, queryClient],
  )

  return { handleValidateChoiceQuestion }
}
