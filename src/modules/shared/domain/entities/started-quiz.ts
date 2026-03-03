import { Schema } from "effect"

export const startedQuizSchema = Schema.Struct({
  category: Schema.String,
  completedQuestions: Schema.Number.pipe(Schema.int()),
  correctQuestionCount: Schema.Number.pipe(Schema.int()),
  createdAt: Schema.DateFromString,
  progressPointer: Schema.optional(Schema.String),
  quiz: Schema.String,
  score: Schema.Number.pipe(Schema.int()),
  spentTime: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  updatedAt: Schema.DateFromString,
  user: Schema.String,
})

export type StartedQuiz = typeof startedQuizSchema.Type
