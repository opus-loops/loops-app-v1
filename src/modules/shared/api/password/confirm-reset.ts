import type { Effect } from "effect"

import { Schema } from "effect"

import { expiredInvalidCodeErrorSchema } from "@/modules/shared/domain/errors/expired-invalid-code"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const confirmResetPasswordUnmatchedPasswordErrorSchema = Schema.Struct({
  code: Schema.Literal("unmatched_password"),
})

export const confirmResetPasswordErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      confirmationCode: Schema.optional(UseCaseErrorSchema),
      confirmPassword: Schema.optional(UseCaseErrorSchema),
      email: Schema.optional(UseCaseErrorSchema),
      password: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  expiredInvalidCodeErrorSchema,
  userNotFoundErrorSchema,
  confirmResetPasswordUnmatchedPasswordErrorSchema,
)

export type ConfirmResetPasswordErrors =
  typeof confirmResetPasswordErrorsSchema.Type

export const confirmResetPasswordSuccessSchema = successResponseSchema

const confirmResetPasswordArgsSchema = Schema.Struct({
  confirmationCode: Schema.Number,
  confirmPassword: Schema.String,
  email: Schema.String,
  password: Schema.String,
})

type ConfirmResetPasswordArgs = typeof confirmResetPasswordArgsSchema.Type
type ConfirmResetPasswordResult = Effect.Effect<
  ConfirmResetPasswordSuccess,
  ConfirmResetPasswordErrors
>
type ConfirmResetPasswordSuccess = typeof confirmResetPasswordSuccessSchema.Type

export const confirmResetPasswordFactory = async () => {
  const instance = await instanceFactory()

  return function confirmResetPassword(
    args: ConfirmResetPasswordArgs,
  ): ConfirmResetPasswordResult {
    const parsedArgs = parseEffectSchema(confirmResetPasswordArgsSchema, args)
    const response = instance.post("/password/confirm", parsedArgs)

    return parseApiResponse({
      error: {
        name: "ConfirmResetPasswordErrors",
        schema: confirmResetPasswordErrorsSchema,
      },
      name: "ConfirmResetPassword",
      success: {
        name: "ConfirmResetPasswordSuccess",
        schema: confirmResetPasswordSuccessSchema,
      },
    })(response)
  }
}
