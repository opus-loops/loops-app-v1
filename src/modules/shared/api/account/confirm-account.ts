import { expiredInvalidCodeErrorSchema } from "@/modules/shared/domain/errors/expired-invalid-code"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"
import { instanceFactory } from "../../utils/axios"

const confirmAccountArgsSchema = Schema.Struct({
  confirmationCode: Schema.Number.pipe(Schema.int()),
})

type ConfirmAccountArgs = typeof confirmAccountArgsSchema.Type

export const confirmAccountErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      confirmationCode: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
  expiredInvalidCodeErrorSchema,
)

export type ConfirmAccountErrors = typeof confirmAccountErrorsSchema.Type

export const confirmAccountSuccessSchema = successMessageSchema
type ConfirmAccountResult = Effect.Effect<
  ConfirmAccountSuccess,
  ConfirmAccountErrors
>
type ConfirmAccountSuccess = typeof confirmAccountSuccessSchema.Type

export const confirmAccountExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: confirmAccountErrorsSchema,
  success: confirmAccountSuccessSchema,
})

export const confirmAccountFactory = async () => {
  const instance = await instanceFactory()

  return function confirmAccount(
    args: ConfirmAccountArgs,
  ): ConfirmAccountResult {
    const parsedArgs = parseEffectSchema(confirmAccountArgsSchema, args)

    const response = instance.post("/account/confirm", parsedArgs)

    return parseApiResponse({
      error: {
        name: "ConfirmAccountErrors",
        schema: confirmAccountErrorsSchema,
      },
      name: "ConfirmAccount",
      success: {
        name: "ConfirmAccountSuccess",
        schema: confirmAccountSuccessSchema,
      },
    })(response)
  }
}
