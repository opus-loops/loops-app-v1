import { completedSequenceOrderSchema } from "@/modules/shared/domain/entities/completed-sequence-order"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { notQuizQuestionErrorSchema } from "@/modules/shared/domain/errors/not-quiz-question"
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

const getCompletedSequenceOrderArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type GetCompletedSequenceOrderArgs =
  typeof getCompletedSequenceOrderArgsSchema.Type

export const getCompletedSequenceOrderErrorsSchema = Schema.Union(
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
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  quizNotStartedErrorSchema,
  subQuizNotStartedErrorSchema,
  subQuizNotFoundErrorSchema,
  notQuizQuestionErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetCompletedSequenceOrderErrors =
  typeof getCompletedSequenceOrderErrorsSchema.Type

export const getCompletedSequenceOrderSuccessSchema = Schema.Struct({
  completedSequenceOrder: completedSequenceOrderSchema,
})

export type GetCompletedSequenceOrderSuccess =
  typeof getCompletedSequenceOrderSuccessSchema.Type

type GetCompletedSequenceOrderResult = Effect.Effect<
  GetCompletedSequenceOrderSuccess,
  GetCompletedSequenceOrderErrors
>

export const getCompletedSequenceOrderExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getCompletedSequenceOrderErrorsSchema,
  success: getCompletedSequenceOrderSuccessSchema,
})

export type GetCompletedSequenceOrderExit =
  typeof getCompletedSequenceOrderExitSchema.Type

export const getCompletedSequenceOrderFactory = async () => {
  const instance = await instanceFactory()

  return function getCompletedSequenceOrder(
    args: GetCompletedSequenceOrderArgs,
  ): GetCompletedSequenceOrderResult {
    const parsedArgs = parseEffectSchema(
      getCompletedSequenceOrderArgsSchema,
      args,
    )
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/sequence_orders/${parsedArgs.questionId}/completed`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetCompletedSequenceOrderErrors",
        schema: getCompletedSequenceOrderErrorsSchema,
      },
      name: "GetCompletedSequenceOrder",
      success: {
        name: "GetCompletedSequenceOrderSuccess",
        schema: getCompletedSequenceOrderSuccessSchema,
      },
    })(response)
  }
}
