import { Schema } from "effect"

import { textContentSchema } from "../value_objects/text-content"

export const choiceQuestionSchema = Schema.Struct({
  choiceQuestionId: Schema.String,
  choices: Schema.Array(Schema.Array(textContentSchema)),
  congratulatoryMessage: Schema.Array(textContentSchema),
  consolidationMessage: Schema.Array(textContentSchema),
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  estimatedTime: Schema.Number.pipe(Schema.int()),
  headline: Schema.Array(textContentSchema),
  idealOptions: Schema.optional(Schema.Array(Schema.Number.pipe(Schema.int()))),
  isMultiple: Schema.Boolean,
  metaTags: Schema.Array(Schema.String),
  score: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  version: Schema.Number.pipe(Schema.int()),
})

export type ChoiceQuestion = typeof choiceQuestionSchema.Type
