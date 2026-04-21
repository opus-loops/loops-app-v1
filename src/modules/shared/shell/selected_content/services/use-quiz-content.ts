import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { redirect } from "@tanstack/react-router"

import { useGlobalError } from "../../session/global-error-provider"
import { getQuizContentFn } from "./get-quiz-content-fn"

interface QuizContentParams {
  categoryId: string
  quizId: string
}

export const quizContentQuery = (
  params: QuizContentParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await getQuizContentFn({
        data: {
          categoryId: params.categoryId,
          quizId: params.quizId,
        },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch quiz content")
      }

      if (response.value.quiz === null)
        throw redirect({
          search: {
            category: params.categoryId,
            type: "content",
          },
          to: "/",
        })

      return response.value
    },
    queryKey: ["quiz-content", params.categoryId, params.quizId],
  })

export function useQuizContent(params: QuizContentParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    quizContentQuery(params, handleSessionExpired),
  )
  return { startedQuiz: data.startedQuiz, subQuizzes: data.subQuizzes }
}
