import { Schema } from "effect"

export const userAlreadyExistErrorSchema = Schema.Struct({
  code: Schema.Literal("user_already_exist"),
})

export type UserAlreadyExistError = typeof userAlreadyExistErrorSchema.Type
