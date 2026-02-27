import { Schema } from "effect"
import { textContentSchema } from "../value_objects/text-content"

export const skillContentSchema = Schema.Struct({
  skill: Schema.String,
  version: Schema.Number.pipe(Schema.int()),
  contentURL: Schema.Array(textContentSchema),
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  createdAt: Schema.DateFromString,
})

export type SkillContent = typeof skillContentSchema.Type
