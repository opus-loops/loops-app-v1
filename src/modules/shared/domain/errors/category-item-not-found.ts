import { Schema } from "effect"

export const categoryItemNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("category_item_not_found"),
})

export type CategoryItemNotFoundError =
  typeof categoryItemNotFoundErrorSchema.Type
