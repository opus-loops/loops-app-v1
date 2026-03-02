import { Schema } from "effect"

export const invalidTokenErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_token"),
})

export type InvalidTokenError = typeof invalidTokenErrorSchema.Type
