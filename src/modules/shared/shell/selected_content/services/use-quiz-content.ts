import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { getQuizContentFn } from "./get-quiz-content-fn"

interface QuizContentParams {
  categoryId: string
  quizId: string
}

export const quizContentQuery = (params: QuizContentParams) =>
  queryOptions({
    queryKey: ["quiz-content", params.categoryId, params.quizId],
    queryFn: async () => {
      const response = await getQuizContentFn({
        data: {
          categoryId: params.categoryId,
          quizId: params.quizId,
        },
      })

      if (response._tag === "Failure")
        throw new Error("Failed to fetch quiz content")

      return response.value
    },
  })

export function useQuizContent(params: QuizContentParams) {
  const { data } = useSuspenseQuery(quizContentQuery(params))
  return { subQuizzes: data.subQuizzes }
}
