import { Schema } from "effect"

export const completedChoiceQuestionSchema = Schema.Struct({
  category: Schema.String,
  createdAt: Schema.DateFromString,
  question: Schema.String,
  quiz: Schema.String,
  score: Schema.Number.pipe(Schema.int()),
  spentTime: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  updatedAt: Schema.DateFromString,
  user: Schema.String,
  userAnswer: Schema.optional(Schema.Array(Schema.Number.pipe(Schema.int()))),
  version: Schema.Number.pipe(Schema.int()),
})

export type CompletedChoiceQuestion = typeof completedChoiceQuestionSchema.Type
