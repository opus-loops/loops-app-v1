import { Schema } from "effect"

import { textContentSchema } from "../value_objects/text-content"

export const skillContentSchema = Schema.Struct({
  contentURL: Schema.Array(textContentSchema),
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  skill: Schema.String,
  version: Schema.Number.pipe(Schema.int()),
})

export type SkillContent = typeof skillContentSchema.Type
