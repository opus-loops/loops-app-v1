import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { StartChoiceQuestionWire } from "./start-choice-question-fn.server"
import { startChoiceQuestionFn } from "./start-choice-question-fn.server"

export function useStartChoiceQuestion() {
  const queryClient = useQueryClient()
  const startChoiceQuestion = useServerFn(startChoiceQuestionFn)

  const handleStartChoiceQuestion = useCallback(
    async ({
      categoryId,
      quizId,
      questionId,
    }: {
      categoryId: string
      quizId: string
      questionId: string
    }) => {
      // Call server function → returns JSON-safe union
      const response = (await startChoiceQuestion({
        data: { categoryId, quizId, questionId },
      })) as StartChoiceQuestionWire

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["sub-quiz-content", categoryId, quizId, questionId],
        })
      }

      return response
    },
    [startChoiceQuestion, queryClient],
  )

  return { handleStartChoiceQuestion }
}
