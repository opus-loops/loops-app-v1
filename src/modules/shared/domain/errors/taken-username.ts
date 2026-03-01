import { Schema } from "effect"

export const takenUsernameErrorSchema = Schema.Struct({
  code: Schema.Literal("taken_username"),
  message: Schema.String,
})

export type TakenUsernameError = typeof takenUsernameErrorSchema.Type
