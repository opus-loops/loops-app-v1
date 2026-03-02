import { Schema } from "effect"

export const userNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("user_not_found"),
})

export type UserNotFoundError = typeof userNotFoundErrorSchema.Type
