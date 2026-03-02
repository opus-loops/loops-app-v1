import { categoryAlreadyStartedErrorSchema } from "@/modules/shared/domain/errors/category-already-started"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { invalidExpiredVoucherErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-voucher"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { voucherNotFoundErrorSchema } from "@/modules/shared/domain/errors/voucher-not-found"
import { successResponseWithPayloadSchemaFactory } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import { Effect, Schema } from "effect"

const submitVoucherArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  code: Schema.Number,
})

type SubmitVoucherArgs = typeof submitVoucherArgsSchema.Type

export const submitVoucherErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
      categoryId: Schema.optional(UseCaseErrorSchema),
      code: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  voucherNotFoundErrorSchema,
  invalidExpiredVoucherErrorSchema,
  categoryAlreadyStartedErrorSchema,
  categoryNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type SubmitVoucherErrors = typeof submitVoucherErrorsSchema.Type

export const submitVoucherSuccessSchema =
  successResponseWithPayloadSchemaFactory(
    Schema.Struct({
      categoryId: Schema.String,
      userId: Schema.String,
    }),
  )

export type SubmitVoucherSuccess = typeof submitVoucherSuccessSchema.Type

type SubmitVoucherResult = Effect.Effect<
  SubmitVoucherSuccess,
  SubmitVoucherErrors
>

export const submitVoucherExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: submitVoucherErrorsSchema,
  success: submitVoucherSuccessSchema,
})

export const submitVoucherFactory = async () => {
  const instance = await instanceFactory()

  return function submitVoucher(args: SubmitVoucherArgs): SubmitVoucherResult {
    const parsedArgs = parseEffectSchema(submitVoucherArgsSchema, args)
    const url = `/vouchers/submit`
    const response = instance.post(url, {
      categoryId: parsedArgs.categoryId,
      code: parsedArgs.code,
    })

    return parseApiResponse({
      error: {
        name: "SubmitVoucherErrors",
        schema: submitVoucherErrorsSchema,
      },
      name: "SubmitVoucher",
      success: {
        name: "SubmitVoucherSuccess",
        schema: submitVoucherSuccessSchema,
      },
    })(response)
  }
}
