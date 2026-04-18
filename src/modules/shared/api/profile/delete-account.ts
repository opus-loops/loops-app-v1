import type { Effect } from "effect"

import { Schema } from "effect"

import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

export const deleteAccountErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      reason: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  userNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type DeleteAccountErrors = typeof deleteAccountErrorsSchema.Type

export const deleteAccountSuccessSchema = Schema.Struct({
  isSuccess: Schema.Literal(true),
})

export type DeleteAccountSuccess = typeof deleteAccountSuccessSchema.Type

const deleteAccountArgsSchema = Schema.Struct({
  reason: Schema.optional(Schema.String),
})

export type DeleteAccountArgs = typeof deleteAccountArgsSchema.Type

type DeleteAccountResult = Effect.Effect<
  DeleteAccountSuccess,
  DeleteAccountErrors
>

export const deleteAccountFactory = async () => {
  const instance = await instanceFactory()

  return function deleteAccount(args: DeleteAccountArgs): DeleteAccountResult {
    const parsedArgs = parseEffectSchema(deleteAccountArgsSchema, args)
    const response = instance.delete("/profile", { data: parsedArgs })

    return parseApiResponse({
      error: {
        name: "DeleteAccountErrors",
        schema: deleteAccountErrorsSchema,
      },
      name: "DeleteAccount",
      success: {
        name: "DeleteAccountSuccess",
        schema: deleteAccountSuccessSchema,
      },
    })(response)
  }
}
