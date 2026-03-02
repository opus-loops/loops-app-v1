import { Schema } from "effect"

export const quizNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("quiz_not_found"),
})

export type QuizNotFoundError = typeof quizNotFoundErrorSchema.Type
