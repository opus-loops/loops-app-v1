import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { unmatchedPasswordErrorSchema } from "@/modules/shared/domain/errors/unmatched-password"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { userPasswordNotSetOrInvalidProviderErrorSchema } from "@/modules/shared/domain/errors/user-password-not-set-or-invalid-provider"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

export const updatePasswordErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      password: Schema.optional(Schema.String),
      newPassword: Schema.optional(Schema.String),
    }),
  ),
  unmatchedPasswordErrorSchema,
  userNotFoundErrorSchema,
  userPasswordNotSetOrInvalidProviderErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type UpdatePasswordErrors = typeof updatePasswordErrorsSchema.Type

export const updatePasswordSuccessSchema = successMessageSchema

type UpdatePasswordResult = Effect.Effect<
  UpdatePasswordSuccess,
  UpdatePasswordErrors
>
type UpdatePasswordSuccess = typeof updatePasswordSuccessSchema.Type

const updatePasswordArgsSchema = Schema.Struct({
  password: Schema.String,
  newPassword: Schema.String,
})

type UpdatePasswordArgs = typeof updatePasswordArgsSchema.Type

export const updatePasswordFactory = async () => {
  const instance = await instanceFactory()

  return function updatePassword(
    args: UpdatePasswordArgs,
  ): UpdatePasswordResult {
    const parsedArgs = parseEffectSchema(updatePasswordArgsSchema, args)
    const response = instance.patch("/profile/password", parsedArgs)

    return parseApiResponse({
      error: {
        name: "UpdatePasswordErrors",
        schema: updatePasswordErrorsSchema,
      },
      name: "UpdatePassword",
      success: {
        name: "UpdatePasswordSuccess",
        schema: updatePasswordSuccessSchema,
      },
    })(response)
  }
}
