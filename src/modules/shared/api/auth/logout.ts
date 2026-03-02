import type { Effect } from "effect"
import { Schema } from "effect"

import { internalErrorSchema } from "../../domain/errors/internal-error"
import { invalidExpiredTokenErrorSchema } from "../../domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "../../domain/errors/user-not-found"
import { successResponseSchema } from "../../domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "../../domain/utils/invalid-input"
import { instanceFactory } from "../../utils/axios"
import { parseApiResponse } from "../../utils/parse-api-response"
import { parseEffectSchema } from "../../utils/parse-effect-schema"

const logoutArgsSchema = Schema.Struct({ refreshToken: Schema.String })
type LogoutArgs = Schema.Schema.Type<typeof logoutArgsSchema>

export const logoutErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(UseCaseErrorSchema),
      refreshToken: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  internalErrorSchema,
  userNotFoundErrorSchema,
)

export type LogoutErrors = typeof logoutErrorsSchema.Type

// Success schema
export const logoutSuccessSchema = successResponseSchema
export type LogoutSuccess = typeof logoutSuccessSchema.Type

type LogoutResult = Effect.Effect<LogoutSuccess, LogoutErrors>

export const logoutFactory = async () => {
  const instance = await instanceFactory()

  return function logout(args: LogoutArgs): LogoutResult {
    const parsedArgs = parseEffectSchema(
      Schema.Struct({ refreshToken: Schema.String }),
      args,
    )

    const response = instance.post("/auth/logout", parsedArgs)

    return parseApiResponse({
      error: {
        name: "LogoutErrors",
        schema: logoutErrorsSchema,
      },
      name: "Logout",
      success: {
        name: "LogoutSuccess",
        schema: logoutSuccessSchema,
      },
    })(response)
  }
}
