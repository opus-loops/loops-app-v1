import type { Effect } from "effect"

import { Schema } from "effect"

import { voucherRequestSchema } from "@/modules/shared/domain/entities/voucher-request"
import { internalErrorSchema } from "@/modules/shared/domain/errors/internal-error"
import { resourceAccessForbiddenErrorSchema } from "@/modules/shared/domain/errors/resource-access-forbidden"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { voucherRequestNotFoundErrorSchema } from "@/modules/shared/domain/errors/voucher-request-not-found"
import { successResponseWithPayloadSchemaFactory } from "@/modules/shared/domain/types/success-response"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getVoucherRequestArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type GetVoucherRequestArgs = typeof getVoucherRequestArgsSchema.Type

export const getVoucherRequestErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  voucherRequestNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  resourceAccessForbiddenErrorSchema,
  internalErrorSchema,
)

export type GetVoucherRequestErrors =
  typeof getVoucherRequestErrorsSchema.Type

export const getVoucherRequestSuccessSchema =
  successResponseWithPayloadSchemaFactory(voucherRequestSchema)

export type GetVoucherRequestSuccess =
  typeof getVoucherRequestSuccessSchema.Type

type GetVoucherRequestResult = Effect.Effect<
  GetVoucherRequestSuccess,
  GetVoucherRequestErrors
>

export const getVoucherRequestFactory = async () => {
  const instance = await instanceFactory()

  return function getVoucherRequest(
    args: GetVoucherRequestArgs,
  ): GetVoucherRequestResult {
    const parsedArgs = parseEffectSchema(getVoucherRequestArgsSchema, args)
    const response = instance.get(
      `/voucher_requests/categories/${parsedArgs.categoryId}`,
    )

    return parseApiResponse({
      error: {
        name: "GetVoucherRequestErrors",
        schema: getVoucherRequestErrorsSchema,
      },
      name: "GetVoucherRequest",
      success: {
        name: "GetVoucherRequestSuccess",
        schema: getVoucherRequestSuccessSchema,
      },
    })(response)
  }
}
