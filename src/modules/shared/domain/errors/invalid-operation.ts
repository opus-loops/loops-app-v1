import { Schema } from "effect"

export const invalidOperationErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_operation"),
})

export type InvalidOperationError = typeof invalidOperationErrorSchema.Type
