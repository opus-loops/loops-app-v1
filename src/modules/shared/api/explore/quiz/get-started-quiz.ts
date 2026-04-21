import type { Effect } from "effect"

import { Schema } from "effect"

import { startedQuizSchema } from "@/modules/shared/domain/entities/started-quiz"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getStartedQuizArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
})

type GetStartedQuizArgs = typeof getStartedQuizArgsSchema.Type

export const getStartedQuizErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      quizId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
)

export type GetStartedQuizErrors = typeof getStartedQuizErrorsSchema.Type

export const getStartedQuizSuccessSchema = Schema.Struct({
  startedQuiz: Schema.NullOr(startedQuizSchema),
})

export type GetStartedQuizSuccess = typeof getStartedQuizSuccessSchema.Type

type GetStartedQuizResult = Effect.Effect<
  GetStartedQuizSuccess,
  GetStartedQuizErrors
>

export const getStartedQuizExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getStartedQuizErrorsSchema,
  success: getStartedQuizSuccessSchema,
})

export const getStartedQuizFactory = async () => {
  const instance = await instanceFactory()

  return function getStartedQuiz(
    args: GetStartedQuizArgs,
  ): GetStartedQuizResult {
    const parsedArgs = parseEffectSchema(getStartedQuizArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/started`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetStartedQuizErrors",
        schema: getStartedQuizErrorsSchema,
      },
      name: "GetStartedQuiz",
      success: {
        name: "GetStartedQuizSuccess",
        schema: getStartedQuizSuccessSchema,
      },
    })(response)
  }
}
