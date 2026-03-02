import { Schema } from "effect"

export const expiredInvalidCodeErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_expired_code"),
})

export type ExpiredInvalidCodeError = typeof expiredInvalidCodeErrorSchema.Type
