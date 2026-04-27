import type { Effect } from "effect"

import { Schema } from "effect"

import { emailNotFoundErrorSchema } from "@/modules/shared/domain/errors/email-not-found"
import { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

export const requestResetPasswordErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      email: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  emailNotFoundErrorSchema,
)

export type RequestResetPasswordErrors =
  typeof requestResetPasswordErrorsSchema.Type

export const requestResetPasswordSuccessSchema = successResponseSchema

const requestResetPasswordArgsSchema = Schema.Struct({
  email: Schema.String,
})

type RequestResetPasswordArgs = typeof requestResetPasswordArgsSchema.Type
type RequestResetPasswordResult = Effect.Effect<
  RequestResetPasswordSuccess,
  RequestResetPasswordErrors
>
type RequestResetPasswordSuccess = typeof requestResetPasswordSuccessSchema.Type

export const requestResetPasswordFactory = async () => {
  const instance = await instanceFactory()

  return function requestResetPassword(
    args: RequestResetPasswordArgs,
  ): RequestResetPasswordResult {
    const parsedArgs = parseEffectSchema(requestResetPasswordArgsSchema, args)
    const response = instance.post("/password/reset", parsedArgs)

    return parseApiResponse({
      error: {
        name: "RequestResetPasswordErrors",
        schema: requestResetPasswordErrorsSchema,
      },
      name: "RequestResetPassword",
      success: {
        name: "RequestResetPasswordSuccess",
        schema: requestResetPasswordSuccessSchema,
      },
    })(response)
  }
}
