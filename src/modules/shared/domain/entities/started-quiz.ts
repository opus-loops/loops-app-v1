import { Schema } from "effect"

export const startedQuizSchema = Schema.Struct({
  user: Schema.String,
  category: Schema.String,
  quiz: Schema.String,
  status: Schema.String,
  score: Schema.Number.pipe(Schema.int()),
  completedQuestions: Schema.Number.pipe(Schema.int()),
  spentTime: Schema.Number.pipe(Schema.int()),
  correctQuestionCount: Schema.Number.pipe(Schema.int()),
  progressPointer: Schema.optional(Schema.String),
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
})

export type StartedQuiz = typeof startedQuizSchema.Type
