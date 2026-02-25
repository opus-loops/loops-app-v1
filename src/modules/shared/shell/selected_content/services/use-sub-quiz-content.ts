import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { getSubQuizContentFn } from "./get-sub-quiz-content-fn"

interface SubQuizContentParams {
  categoryId: string
  quizId: string
  questionId: string
}

export const subQuizContentQuery = (params: SubQuizContentParams) =>
  queryOptions({
    queryKey: [
      "sub-quiz-content",
      params.categoryId,
      params.quizId,
      params.questionId,
    ],
    queryFn: async () => {
      const response = await getSubQuizContentFn({
        data: {
          categoryId: params.categoryId,
          quizId: params.quizId,
          questionId: params.questionId,
        },
      })

      if (response._tag === "Failure")
        throw new Error("Failed to fetch sub-quiz content")

      return response.value
    },
  })

export function useSubQuizContent(params: SubQuizContentParams) {
  const { data } = useSuspenseQuery(subQuizContentQuery(params))
  return { subQuiz: data.subQuiz }
}
