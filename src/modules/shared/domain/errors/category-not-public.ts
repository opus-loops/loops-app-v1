import { Schema } from "effect"

export const categoryNotPublicErrorSchema = Schema.Struct({
  code: Schema.Literal("category_not_public"),
})

export type CategoryNotPublicError = typeof categoryNotPublicErrorSchema.Type
