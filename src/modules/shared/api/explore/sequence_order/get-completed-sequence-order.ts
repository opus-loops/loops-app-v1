import type { Effect } from "effect"

import { Schema } from "effect"

import { completedSequenceOrderSchema } from "@/modules/shared/domain/entities/completed-sequence-order"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getCompletedSequenceOrderArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  questionId: Schema.String,
  quizId: Schema.String,
})

type GetCompletedSequenceOrderArgs =
  typeof getCompletedSequenceOrderArgsSchema.Type

export const getCompletedSequenceOrderErrorsSchema = Schema.Union(
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

export type GetCompletedSequenceOrderErrors =
  typeof getCompletedSequenceOrderErrorsSchema.Type

export const getCompletedSequenceOrderSuccessSchema = Schema.Struct({
  completedSequenceOrder: Schema.NullOr(completedSequenceOrderSchema),
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
