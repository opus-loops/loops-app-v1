import type { Effect } from "effect"

import { Schema } from "effect"

import { subQuizSchema } from "@/modules/shared/domain/entities/sub-quiz"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getExploreSubQuizArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  questionId: Schema.String,
  quizId: Schema.String,
})

type GetExploreSubQuizArgs = typeof getExploreSubQuizArgsSchema.Type

export const getExploreSubQuizErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      questionId: Schema.optional(UseCaseErrorSchema),
      quizId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
)

export type GetExploreSubQuizErrors = typeof getExploreSubQuizErrorsSchema.Type

export const getExploreSubQuizSuccessSchema = Schema.Struct({
  subQuiz: Schema.NullOr(subQuizSchema),
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
