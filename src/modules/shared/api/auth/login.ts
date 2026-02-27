import { invalidCredentialsErrorSchema } from "@/modules/shared/domain/errors/invalid-credentials"
import { loginTokensSchema } from "@/modules/shared/domain/types/login-tokens"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const loginArgsSchema = Schema.Struct({
  password: Schema.String,
  username: Schema.String,
})

type LoginArgs = typeof loginArgsSchema.Type

export const loginErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      password: Schema.optional(Schema.String),
      username: Schema.optional(Schema.String),
    }),
  ),
  invalidCredentialsErrorSchema,
)

export type LoginErrors = typeof loginErrorsSchema.Type

export const loginSuccessSchema = loginTokensSchema
type LoginResult = Effect.Effect<LoginSuccess, LoginErrors>
type LoginSuccess = typeof loginSuccessSchema.Type

export const loginExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: loginErrorsSchema,
  success: loginSuccessSchema,
})

export const loginFactory = async () => {
  const instance = await instanceFactory()

  return function login(args: LoginArgs): LoginResult {
    const parsedArgs = parseEffectSchema(loginArgsSchema, args)
    const response = instance.post("/auth/login", parsedArgs)

    return parseApiResponse({
      error: {
        name: "LoginErrors",
        schema: loginErrorsSchema,
      },
      name: "Login",
      success: {
        name: "LoginSuccess",
        schema: loginTokensSchema,
      },
    })(response)
  }
}
