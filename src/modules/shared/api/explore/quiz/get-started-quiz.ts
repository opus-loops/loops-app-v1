import { startedQuizSchema } from "@/modules/shared/domain/entities/started-quiz"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getStartedQuizArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
})

type GetStartedQuizArgs = typeof getStartedQuizArgsSchema.Type

export const getStartedQuizErrorsSchema = Schema.Union(
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
  quizNotStartedErrorSchema,
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetStartedQuizErrors = typeof getStartedQuizErrorsSchema.Type

export const getStartedQuizSuccessSchema = Schema.Struct({
  startedQuiz: startedQuizSchema,
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
