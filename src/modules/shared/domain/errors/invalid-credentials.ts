import { Schema } from "effect"

export const invalidCredentialsErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_credentials"),
})

export type InvalidCredentialsError = typeof invalidCredentialsErrorSchema.Type
