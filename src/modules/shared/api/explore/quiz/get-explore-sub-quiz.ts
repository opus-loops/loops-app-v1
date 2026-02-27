import { subQuizSchema } from "@/modules/shared/domain/entities/sub-quiz"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { subQuizNotFoundErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getExploreSubQuizArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type GetExploreSubQuizArgs = typeof getExploreSubQuizArgsSchema.Type

export const getExploreSubQuizErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
      questionId: Schema.optional(Schema.String),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  quizNotStartedErrorSchema,
  quizNotFoundErrorSchema,
  subQuizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetExploreSubQuizErrors = typeof getExploreSubQuizErrorsSchema.Type

export const getExploreSubQuizSuccessSchema = Schema.Struct({
  subQuiz: subQuizSchema,
})

export type GetExploreSubQuizSuccess =
  typeof getExploreSubQuizSuccessSchema.Type

type GetExploreSubQuizResult = Effect.Effect<
  GetExploreSubQuizSuccess,
  GetExploreSubQuizErrors
>

export const getExploreSubQuizExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreSubQuizErrorsSchema,
  success: getExploreSubQuizSuccessSchema,
})

export const getExploreSubQuizFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreSubQuiz(
    args: GetExploreSubQuizArgs,
  ): GetExploreSubQuizResult {
    const parsedArgs = parseEffectSchema(getExploreSubQuizArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/questions/${parsedArgs.questionId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreSubQuizErrors",
        schema: getExploreSubQuizErrorsSchema,
      },
      name: "GetExploreSubQuiz",
      success: {
        name: "GetExploreSubQuizSuccess",
        schema: getExploreSubQuizSuccessSchema,
      },
    })(response)
  }
}
