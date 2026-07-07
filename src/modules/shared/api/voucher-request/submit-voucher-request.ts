import type { Effect } from "effect"

import { Schema } from "effect"

import { categoryAlreadyStartedErrorSchema } from "@/modules/shared/domain/errors/category-already-started"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotPublicErrorSchema } from "@/modules/shared/domain/errors/category-not-public"
import { internalErrorSchema } from "@/modules/shared/domain/errors/internal-error"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { voucherRequestAlreadyPendingErrorSchema } from "@/modules/shared/domain/errors/voucher-request-already-pending"
import { successResponseWithPayloadSchemaFactory } from "@/modules/shared/domain/types/success-response"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const submitVoucherRequestArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type SubmitVoucherRequestArgs = typeof submitVoucherRequestArgsSchema.Type

export const submitVoucherRequestErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  categoryNotPublicErrorSchema,
  categoryNotFoundErrorSchema,
  categoryAlreadyStartedErrorSchema,
  voucherRequestAlreadyPendingErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
  internalErrorSchema,
)

export type SubmitVoucherRequestErrors =
  typeof submitVoucherRequestErrorsSchema.Type

export const submitVoucherRequestSuccessSchema =
  successResponseWithPayloadSchemaFactory(
    Schema.Struct({
      categoryId: Schema.String,
      userId: Schema.String,
    }),
  )

export type SubmitVoucherRequestSuccess =
  typeof submitVoucherRequestSuccessSchema.Type

type SubmitVoucherRequestResult = Effect.Effect<
  SubmitVoucherRequestSuccess,
  SubmitVoucherRequestErrors
>

export const submitVoucherRequestFactory = async () => {
  const instance = await instanceFactory()

  return function submitVoucherRequest(
    args: SubmitVoucherRequestArgs,
  ): SubmitVoucherRequestResult {
    const parsedArgs = parseEffectSchema(submitVoucherRequestArgsSchema, args)
    const response = instance.post("/voucher_requests", {
      categoryId: parsedArgs.categoryId,
    })

    return parseApiResponse({
      error: {
        name: "SubmitVoucherRequestErrors",
        schema: submitVoucherRequestErrorsSchema,
      },
      name: "SubmitVoucherRequest",
      success: {
        name: "SubmitVoucherRequestSuccess",
        schema: submitVoucherRequestSuccessSchema,
      },
    })(response)
  }
}
