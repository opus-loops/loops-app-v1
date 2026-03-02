import { Schema } from "effect"

export const categoryNotStartedErrorSchema = Schema.Struct({
  code: Schema.Literal("category_not_started"),
})

export type CategoryNotStartedError = typeof categoryNotStartedErrorSchema.Type
