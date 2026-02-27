import { Schema } from "effect"
import { textContentSchema } from "../value_objects/text-content"

export const choiceQuestionSchema = Schema.Struct({
  version: Schema.Number.pipe(Schema.int()),
  choiceQuestionId: Schema.String,
  headline: Schema.Array(textContentSchema),
  choices: Schema.Array(Schema.Array(textContentSchema)),
  metaTags: Schema.Array(Schema.String),
  idealOptions: Schema.optional(Schema.Array(Schema.Number.pipe(Schema.int()))),
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  estimatedTime: Schema.Number.pipe(Schema.int()),
  isMultiple: Schema.Boolean,
  status: Schema.String,
  createdAt: Schema.DateFromString,
})

export type ChoiceQuestion = typeof choiceQuestionSchema.Type
