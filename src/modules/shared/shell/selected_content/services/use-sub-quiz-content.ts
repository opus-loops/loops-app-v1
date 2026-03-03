import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { useGlobalError } from "../../session/global-error-provider"
import { getSubQuizContentFn } from "./get-sub-quiz-content-fn"

interface SubQuizContentParams {
  categoryId: string
  questionId: string
  quizId: string
}

export const subQuizContentQuery = (
  params: SubQuizContentParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await getSubQuizContentFn({
        data: {
          categoryId: params.categoryId,
          questionId: params.questionId,
          quizId: params.quizId,
        },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        throw new Error("Failed to fetch sub-quiz content")
      }

      return response.value
    },
    queryKey: [
      "sub-quiz-content",
      params.categoryId,
      params.quizId,
      params.questionId,
    ],
  })

export function useSubQuizContent(params: SubQuizContentParams) {
  const { handleSessionExpired } = useGlobalError()
  const { data } = useSuspenseQuery(
    subQuizContentQuery(params, handleSessionExpired),
  )
  return { subQuiz: data.subQuiz }
}
