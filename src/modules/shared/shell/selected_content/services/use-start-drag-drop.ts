import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { StartDragDropWire } from "./start-drag-drop-fn.server"
import { startDragDropFn } from "./start-drag-drop-fn.server"

export function useStartDragDrop() {
  const queryClient = useQueryClient()
  const startDragDrop = useServerFn(startDragDropFn)

  const handleStartDragDrop = useCallback(
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
      const response = (await startDragDrop({
        data: { categoryId, quizId, questionId },
      })) as StartDragDropWire

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["sub-quiz-content", categoryId, quizId, questionId],
        })
      }

      return response
    },
    [startDragDrop, queryClient],
  )

  return { handleStartDragDrop }
}
