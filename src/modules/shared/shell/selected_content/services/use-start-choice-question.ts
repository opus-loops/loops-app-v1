import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { useGlobalError } from "../../session/global-error-provider"
import type { StartChoiceQuestionWire } from "./start-choice-question-fn"
import { startChoiceQuestionFn } from "./start-choice-question-fn"

export function useStartChoiceQuestion() {
  const queryClient = useQueryClient()
  const { handleSessionExpired } = useGlobalError()
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

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["single-category-item", categoryId, quizId],
        })

        await queryClient.invalidateQueries({
          queryKey: ["quiz-content", categoryId, quizId],
        })
      }

      return response
    },
    [startChoiceQuestion, queryClient, handleSessionExpired],
  )

  return { handleStartChoiceQuestion }
}
