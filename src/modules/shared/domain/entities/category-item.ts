import { Schema } from "effect"

export const categoryItemSchema = Schema.Struct({
  categoryId: Schema.String,
  categoryItemId: Schema.String,
  itemId: Schema.String,
  itemType: Schema.Literal("skills", "quizzes"),
  nextCategoryItem: Schema.optional(Schema.String),
  previousCategoryItem: Schema.optional(Schema.String),
})

export type CategoryItem = typeof categoryItemSchema.Type
