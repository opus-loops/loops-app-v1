import type { AxiosResponse } from "axios"

import { getRequestHeaders } from "@tanstack/react-start/server"
import axios from "axios"
import { Effect, Schema } from "effect"

import { logServerError, recordMetric } from "@/server/telemetry/helpers"

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
  const headers = getRequestHeaders()
  const userAgent = headers.get("user-agent") ?? undefined

  const parsedArgs = args
    ? parseEffectSchema(Schema.Struct({ refresh: Schema.String }), args)
    : undefined

  const url = import.meta.env.VITE_API_URL + "/auth/refresh"

  const response = instrumentRefreshRequest(
    axios.post(
      url,
      { refreshToken: parsedArgs?.refresh },
      {
        headers: {
          ...(userAgent && {
            "User-Agent": userAgent,
          }),
        },
      },
    ),
  )

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

function instrumentRefreshRequest(
  request: Promise<AxiosResponse>,
): Promise<AxiosResponse> {
  return Effect.runPromise(
    Effect.tapError(
      Effect.tap(
        Effect.tryPromise({
          catch: (error) => error,
          try: () => request,
        }),
        () =>
          Effect.sync(() =>
            recordMetric({ failed: false, name: "auth.tokenRefresh" }),
          ),
      ),
      () =>
        Effect.sync(() => {
          recordMetric({ failed: true, name: "auth.tokenRefresh" })
          logServerError("Token refresh failed", {
            source: "auth.refreshToken",
          })
        }),
    ),
  )
}
