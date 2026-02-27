import { quizSchema } from "@/modules/shared/domain/entities/quiz"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getExploreQuizArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
})

type GetExploreQuizArgs = typeof getExploreQuizArgsSchema.Type

export const getExploreQuizErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
    }),
  ),
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  categoryNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetExploreQuizErrors = typeof getExploreQuizErrorsSchema.Type

export const getExploreQuizSuccessSchema = Schema.Struct({
  quiz: quizSchema,
})

export type GetExploreQuizSuccess = typeof getExploreQuizSuccessSchema.Type

type GetExploreQuizResult = Effect.Effect<
  GetExploreQuizSuccess,
  GetExploreQuizErrors
>

export const getExploreQuizExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreQuizErrorsSchema,
  success: getExploreQuizSuccessSchema,
})

export const getExploreQuizFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreQuiz(
    args: GetExploreQuizArgs,
  ): GetExploreQuizResult {
    const parsedArgs = parseEffectSchema(getExploreQuizArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreQuizErrors",
        schema: getExploreQuizErrorsSchema,
      },
      name: "GetExploreQuiz",
      success: {
        name: "GetExploreQuizSuccess",
        schema: getExploreQuizSuccessSchema,
      },
    })(response)
  }
}
