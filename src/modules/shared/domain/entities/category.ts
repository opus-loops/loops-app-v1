import { Schema } from "effect"
import { imageSchema } from "../value_objects/image"
import { textContentSchema } from "../value_objects/text-content"

export type TextContent = typeof textContentSchema.Type

export const categorySchema = Schema.Struct({
  categoryId: Schema.String,
  slug: Schema.String,
  name: Schema.Array(textContentSchema),
  description: Schema.Array(textContentSchema),
  metaTags: Schema.Array(Schema.String),
  defaultLanguage: Schema.String,
  cover: imageSchema,
  skillCount: Schema.Number.pipe(Schema.int()),
  quizCount: Schema.Number.pipe(Schema.int()),
  totalXP: Schema.Number.pipe(Schema.int()),
  totalItemsCount: Schema.Number.pipe(Schema.int()),
  isPublic: Schema.Boolean,
  difficulty: Schema.Number.pipe(Schema.int()),
  participantsCount: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
})

export type Category = typeof categorySchema.Type
