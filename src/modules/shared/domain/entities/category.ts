import { Schema } from "effect"

import { imageSchema } from "../value_objects/image"
import { textContentSchema } from "../value_objects/text-content"

export type TextContent = typeof textContentSchema.Type

export const categorySchema = Schema.Struct({
  categoryId: Schema.String,
  cover: imageSchema,
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  description: Schema.Array(textContentSchema),
  difficulty: Schema.Number.pipe(Schema.int()),
  isPublic: Schema.Boolean,
  metaTags: Schema.Array(Schema.String),
  name: Schema.Array(textContentSchema),
  participantsCount: Schema.Number.pipe(Schema.int()),
  quizCount: Schema.Number.pipe(Schema.int()),
  skillCount: Schema.Number.pipe(Schema.int()),
  slug: Schema.String,
  status: Schema.String,
  totalItemsCount: Schema.Number.pipe(Schema.int()),
  totalXP: Schema.Number.pipe(Schema.int()),
  updatedAt: Schema.DateFromString,
})

export type Category = typeof categorySchema.Type
