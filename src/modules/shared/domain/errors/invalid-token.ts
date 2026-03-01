import { Schema } from "effect"

export const invalidTokenErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_token"),
  message: Schema.String,
})

export type InvalidTokenError = typeof invalidTokenErrorSchema.Type
