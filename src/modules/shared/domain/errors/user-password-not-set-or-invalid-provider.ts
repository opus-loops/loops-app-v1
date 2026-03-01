import { Schema } from "effect"

export const userPasswordNotSetOrInvalidProviderErrorSchema = Schema.Struct({
  code: Schema.Literal("user_password_not_set_or_invalid_provider"),
  message: Schema.String,
})

export type UserPasswordNotSetOrInvalidProviderError =
  typeof userPasswordNotSetOrInvalidProviderErrorSchema.Type
