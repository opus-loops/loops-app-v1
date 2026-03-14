import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import type { StartQuizWire } from "./start-quiz-fn"

import { useGlobalError } from "../../session/global-error-provider"
import { startQuizFn } from "./start-quiz-fn"

export function useStartQuiz() {
  const startQuizServer = useServerFn(startQuizFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()

  const handleStartQuiz = useCallback(
    async (categoryId: string, quizId: string) => {
      // Call server function → returns JSON-safe union
      const response = await startQuizServer({
        data: { categoryId, quizId },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      // If successful, invalidate relevant queries to refresh data
      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["category-content", categoryId],
        })
      }

      return response
    },
    [startQuizServer, queryClient, handleSessionExpired],
  )

  return { handleStartQuiz }
}
