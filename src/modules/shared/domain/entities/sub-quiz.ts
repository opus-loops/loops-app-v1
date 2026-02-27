import { Schema } from "effect"

export const subQuizSchema = Schema.Struct({
  subQuizId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
  questionType: Schema.String,
  previousSubQuiz: Schema.optional(Schema.String),
  nextSubQuiz: Schema.optional(Schema.String),
})

export type SubQuiz = Schema.Schema.Type<typeof subQuizSchema>
