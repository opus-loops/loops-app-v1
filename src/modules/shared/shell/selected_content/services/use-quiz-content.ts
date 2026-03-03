import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
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
    queryKey: ["quiz-content", params.categoryId, params.quizId],
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
      return response.value
    },
  })

export function useQuizContent(params: QuizContentParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    quizContentQuery(params, handleSessionExpired),
  )
  return { subQuizzes: data.subQuizzes }
}
