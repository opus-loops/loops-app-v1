import { Schema } from "effect"

export const internalErrorSchema = Schema.Struct({
  code: Schema.Literal("internal_server_error"),
  status: Schema.Literal(500),
})

export type InternalError = typeof internalErrorSchema.Type
