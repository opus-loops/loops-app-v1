import { Schema } from "effect"

export const categoryNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("category_not_found"),
})

export type CategoryNotFoundError = typeof categoryNotFoundErrorSchema.Type
