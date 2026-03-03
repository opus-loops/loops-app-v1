import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import { useGlobalError } from "../../session/global-error-provider"
import type { StartSequenceOrderWire } from "./start-sequence-order-fn"
import { startSequenceOrderFn } from "./start-sequence-order-fn"

export function useStartSequenceOrder() {
  const queryClient = useQueryClient()
  const { handleSessionExpired } = useGlobalError()
  const startSequenceOrder = useServerFn(startSequenceOrderFn)

  const handleStartSequenceOrder = useCallback(
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
      const response = (await startSequenceOrder({
        data: { categoryId, quizId, questionId },
      })) as StartSequenceOrderWire

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
    [startSequenceOrder, queryClient, handleSessionExpired],
  )

  return { handleStartSequenceOrder }
}
