import { Schema } from "effect"

export const subQuizSchema = Schema.Struct({
  nextSubQuiz: Schema.optional(Schema.String),
  previousSubQuiz: Schema.optional(Schema.String),
  questionId: Schema.String,
  questionType: Schema.String,
  quizId: Schema.String,
  subQuizId: Schema.String,
})

export type SubQuiz = Schema.Schema.Type<typeof subQuizSchema>
