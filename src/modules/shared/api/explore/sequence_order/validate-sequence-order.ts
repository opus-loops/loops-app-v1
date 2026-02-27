import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { internalErrorSchema } from "@/modules/shared/domain/errors/internal-error"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { notQuizQuestionErrorSchema } from "@/modules/shared/domain/errors/not-quiz-question"
import { questionAlreadyCompletedErrorSchema } from "@/modules/shared/domain/errors/question-already-completed"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { subQuizNotFoundErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-found"
import { subQuizNotStartedErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-started"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

export const validateSequenceOrderArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
  spentTime: Schema.optional(Schema.Number),
  userAnswer: Schema.optional(Schema.Array(Schema.Number)),
})

type ValidateSequenceOrderArgs = typeof validateSequenceOrderArgsSchema.Type

export const validateSequenceOrderErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
      questionId: Schema.optional(Schema.String),
      spentTime: Schema.optional(Schema.String),
      userAnswer: Schema.optional(Schema.String),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  quizNotStartedErrorSchema,
  subQuizNotStartedErrorSchema,
  subQuizNotFoundErrorSchema,
  notQuizQuestionErrorSchema,
  questionAlreadyCompletedErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
  internalErrorSchema,
)

export type ValidateSequenceOrderErrors =
  typeof validateSequenceOrderErrorsSchema.Type

export const validateSequenceOrderSuccessSchema = Schema.Struct({
  questionValidation: Schema.Struct({
    isCorrect: Schema.Boolean,
    userAnswer: Schema.optional(Schema.Array(Schema.Number)),
    expectedResponse: Schema.Array(Schema.Number),
    spentTime: Schema.Number,
    estimatedTime: Schema.Number,
  }),
})

export type ValidateSequenceOrderSuccess =
  typeof validateSequenceOrderSuccessSchema.Type

type ValidateSequenceOrderResult = Effect.Effect<
  ValidateSequenceOrderSuccess,
  ValidateSequenceOrderErrors
>

export const validateSequenceOrderExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: validateSequenceOrderErrorsSchema,
  success: validateSequenceOrderSuccessSchema,
})

export type ValidateSequenceOrderExit =
  typeof validateSequenceOrderExitSchema.Type

export const validateSequenceOrderFactory = async () => {
  const instance = await instanceFactory()

  return function validateSequenceOrder(
    args: ValidateSequenceOrderArgs,
  ): ValidateSequenceOrderResult {
    const parsedArgs = parseEffectSchema(validateSequenceOrderArgsSchema, args)
    const { categoryId, quizId, questionId, ...body } = parsedArgs

    const url = `/explore/categories/${categoryId}/quizzes/${quizId}/sequence_orders/${questionId}/completed`
    const response = instance.patch(url, body)

    return parseApiResponse({
      error: {
        name: "ValidateSequenceOrderErrors",
        schema: validateSequenceOrderErrorsSchema,
      },
      name: "ValidateSequenceOrder",
      success: {
        name: "ValidateSequenceOrderSuccess",
        schema: validateSequenceOrderSuccessSchema,
      },
    })(response)
  }
}
