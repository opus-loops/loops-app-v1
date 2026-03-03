import { Schema } from "effect"
import type { Effect } from "effect"

import { invalidTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-token"
import { phoneNumberAlreadyUsedErrorSchema } from "@/modules/shared/domain/errors/phone-number-already-used"
import { takenUsernameErrorSchema } from "@/modules/shared/domain/errors/taken-username"
import { userAlreadyExistErrorSchema } from "@/modules/shared/domain/errors/user-already-exist"
import { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const registerArgsSchema = Schema.Struct({
  email: Schema.String,
  fullName: Schema.String,
  password: Schema.String,
  phoneNumber: Schema.String,
  username: Schema.String,
})

type RegisterArgs = typeof registerArgsSchema.Type

export const registerErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      email: Schema.optional(UseCaseErrorSchema),
      fullName: Schema.optional(UseCaseErrorSchema),
      password: Schema.optional(UseCaseErrorSchema),
      phoneNumber: Schema.optional(UseCaseErrorSchema),
      username: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  userAlreadyExistErrorSchema,
  takenUsernameErrorSchema,
  phoneNumberAlreadyUsedErrorSchema,
  invalidTokenErrorSchema,
)

export type RegisterErrors = typeof registerErrorsSchema.Type

export const registerSuccessSchema = successResponseSchema
type RegisterResult = Effect.Effect<RegisterSuccess, RegisterErrors>
type RegisterSuccess = typeof registerSuccessSchema.Type

export const registerExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: registerErrorsSchema,
  success: registerSuccessSchema,
})

export const registerFactory = async () => {
  const instance = await instanceFactory()

  return function register(args: RegisterArgs): RegisterResult {
    const parsedArgs = parseEffectSchema(registerArgsSchema, args)
    const response = instance.post("/users/register", parsedArgs)

    return parseApiResponse({
      error: {
        name: "RegisterErrors",
        schema: registerErrorsSchema,
      },
      name: "Register",
      success: {
        name: "RegisterSuccess",
        schema: registerSuccessSchema,
      },
    })(response)
  }
}
