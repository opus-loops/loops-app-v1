import { Schema } from "effect"

export const emailNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("email_not_found"),
})

export type EmailNotFoundError = typeof emailNotFoundErrorSchema.Type
