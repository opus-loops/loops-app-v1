import { Schema } from "effect"

import { textContentSchema } from "../value_objects/text-content"

export const quizSchema = Schema.Struct({
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  easyQuestionsCount: Schema.Number.pipe(Schema.int()),
  hardQuestionsCount: Schema.Number.pipe(Schema.int()),
  label: Schema.Array(textContentSchema),
  mediumQuestionsCount: Schema.Number.pipe(Schema.int()),
  metaTags: Schema.Array(Schema.String),
  questionsCount: Schema.Number.pipe(Schema.int()),
  quizId: Schema.String,
  score: Schema.Number.pipe(Schema.int()),
  slug: Schema.String,
  status: Schema.String,
  totalTime: Schema.Number.pipe(Schema.int()),
  updatedAt: Schema.DateFromString,
})

export type Quiz = typeof quizSchema.Type
