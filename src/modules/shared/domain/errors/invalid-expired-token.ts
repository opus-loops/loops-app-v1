import { Schema } from "effect"

export const invalidExpiredTokenErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_token"),
})

export type InvalidExpiredTokenError =
  typeof invalidExpiredTokenErrorSchema.Type
