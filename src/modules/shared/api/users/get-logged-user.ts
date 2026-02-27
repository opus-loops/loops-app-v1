import type { Effect } from "effect"
import { Schema } from "effect"
import { userSchema } from "../../domain/entities/user"
import { invalidExpiredTokenErrorSchema } from "../../domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "../../domain/errors/user-not-found"
import { invalidInputFactory } from "../../domain/utils/invalid-input"
import { instanceFactory } from "../../utils/axios"
import { parseApiResponse } from "../../utils/parse-api-response"

export const getLoggedUserErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetLoggedUserErrors = typeof getLoggedUserErrorsSchema.Type

type GetLoggedUserResult = Effect.Effect<
  GetLoggedUserSuccess,
  GetLoggedUserErrors
>

export const getLoggedUserSuccessSchema = Schema.Struct({ user: userSchema })
export type GetLoggedUserSuccess = typeof getLoggedUserSuccessSchema.Type

export const getLoggedUserFactory = async () => {
  const instance = await instanceFactory()

  return function getLoggedUser(): GetLoggedUserResult {
    const response = instance.get("/users/logged")

    return parseApiResponse({
      error: {
        name: "GetLoggedUserErrors",
        schema: getLoggedUserErrorsSchema,
      },
      name: "GetLoggedUser",
      success: {
        name: "GetLoggedUserSuccess",
        schema: getLoggedUserSuccessSchema,
      },
    })(response)
  }
}
