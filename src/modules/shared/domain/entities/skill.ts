import { Schema } from "effect"

import { imageSchema } from "../value_objects/image"
import { textContentSchema } from "../value_objects/text-content"

export const skillSchema = Schema.Struct({
  cover: imageSchema,
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  label: Schema.Array(textContentSchema),
  metaTags: Schema.Array(Schema.String),
  recentContentVersion: Schema.Number.pipe(Schema.int()),
  skillId: Schema.String,
  updatedAt: Schema.DateFromString,
})

export type Skill = typeof skillSchema.Type
