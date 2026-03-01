import { invalidTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-token"
import { loginTokensSchema } from "@/modules/shared/domain/types/login-tokens"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const googleLoginArgsSchema = Schema.Struct({
  accessToken: Schema.String,
})

type GoogleLoginArgs = typeof googleLoginArgsSchema.Type

export const googleLoginErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      accessToken: Schema.optional(Schema.String),
    }),
  ),
  invalidTokenErrorSchema,
)

export type GoogleLoginErrors = typeof googleLoginErrorsSchema.Type

export const googleLoginSuccessSchema = loginTokensSchema
type GoogleLoginResult = Effect.Effect<GoogleLoginSuccess, GoogleLoginErrors>
type GoogleLoginSuccess = typeof googleLoginSuccessSchema.Type

export const googleLoginExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: googleLoginErrorsSchema,
  success: googleLoginSuccessSchema,
})

export const googleLoginFactory = async () => {
  const instance = await instanceFactory()

  return function googleLogin(args: GoogleLoginArgs): GoogleLoginResult {
    const parsedArgs = parseEffectSchema(googleLoginArgsSchema, args)
    const response = instance.post("/auth/google", parsedArgs)

    return parseApiResponse({
      error: {
        name: "GoogleLoginErrors",
        schema: googleLoginErrorsSchema,
      },
      name: "GoogleLogin",
      success: {
        name: "GoogleLoginSuccess",
        schema: loginTokensSchema,
      },
    })(response)
  }
}
