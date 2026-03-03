import { Schema } from "effect"

export const phoneNumberAlreadyUsedErrorSchema = Schema.Struct({
  code: Schema.Literal("phone_number_already_used"),
})

export type PhoneNumberAlreadyUsedError =
  typeof phoneNumberAlreadyUsedErrorSchema.Type
