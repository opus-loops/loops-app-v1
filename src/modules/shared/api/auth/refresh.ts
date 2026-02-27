import axios from "axios"
import type { Effect } from "effect"
import { Schema } from "effect"
import { invalidRefreshTokenErrorSchema } from "../../domain/errors/invalid-refresh-token"
import { userNotFoundErrorSchema } from "../../domain/errors/user-not-found"
import { loginTokensSchema } from "../../domain/types/login-tokens"
import { invalidInputFactory } from "../../domain/utils/invalid-input"
import { parseApiResponse } from "../../utils/parse-api-response"
import { parseEffectSchema } from "../../utils/parse-effect-schema"

const refreshArgsSchema = Schema.Struct({ refresh: Schema.String })
type RefreshArgs = Schema.Schema.Type<typeof refreshArgsSchema>

const refreshErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({ refreshToken: Schema.optional(Schema.String) }),
  ),
  invalidRefreshTokenErrorSchema,
  userNotFoundErrorSchema,
)

const refreshSuccessSchema = loginTokensSchema
type RefreshErrors = typeof refreshErrorsSchema.Type
type RefreshResult = Effect.Effect<RefreshSuccess, RefreshErrors>
type RefreshSuccess = typeof refreshSuccessSchema.Type

export function refreshAccessToken(args?: RefreshArgs): RefreshResult {
  const parsedArgs = args
    ? parseEffectSchema(Schema.Struct({ refresh: Schema.String }), args)
    : undefined

  const url = import.meta.env.VITE_API_URL + "/auth/refresh"
  const response = axios.post(url, {
    refreshToken: parsedArgs?.refresh,
  })

  return parseApiResponse({
    error: {
      name: "RefreshErrors",
      schema: refreshErrorsSchema,
    },
    name: "Refresh",
    success: {
      name: "RefreshSuccess",
      schema: refreshSuccessSchema,
    },
  })(response)
}
