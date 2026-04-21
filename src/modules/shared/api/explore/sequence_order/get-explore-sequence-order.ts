import type { Effect } from "effect"

import { Schema } from "effect"

import { sequenceOrderSchema } from "@/modules/shared/domain/entities/sequence-order"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getExploreSequenceOrderArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  questionId: Schema.String,
  quizId: Schema.String,
})

type GetExploreSequenceOrderArgs = typeof getExploreSequenceOrderArgsSchema.Type

export const getExploreSequenceOrderErrorsSchema = Schema.Union(
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

export type GetExploreSequenceOrderErrors =
  typeof getExploreSequenceOrderErrorsSchema.Type

export const getExploreSequenceOrderSuccessSchema = Schema.Struct({
  sequenceOrder: Schema.NullOr(sequenceOrderSchema),
})

export type GetExploreSequenceOrderSuccess =
  typeof getExploreSequenceOrderSuccessSchema.Type

type GetExploreSequenceOrderResult = Effect.Effect<
  GetExploreSequenceOrderSuccess,
  GetExploreSequenceOrderErrors
>

export const getExploreSequenceOrderExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreSequenceOrderErrorsSchema,
  success: getExploreSequenceOrderSuccessSchema,
})

export const getExploreSequenceOrderFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreSequenceOrder(
    args: GetExploreSequenceOrderArgs,
  ): GetExploreSequenceOrderResult {
    const parsedArgs = parseEffectSchema(
      getExploreSequenceOrderArgsSchema,
      args,
    )
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/sequence_orders/${parsedArgs.questionId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreSequenceOrderErrors",
        schema: getExploreSequenceOrderErrorsSchema,
      },
      name: "GetExploreSequenceOrder",
      success: {
        name: "GetExploreSequenceOrderSuccess",
        schema: getExploreSequenceOrderSuccessSchema,
      },
    })(response)
  }
}
