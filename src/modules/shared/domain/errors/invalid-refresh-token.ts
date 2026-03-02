import { Schema } from "effect"

export const invalidRefreshTokenErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_refresh_token"),
})

export type InvalidRefreshTokenError =
  typeof invalidRefreshTokenErrorSchema.Type
