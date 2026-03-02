import { Schema } from "effect"

export const quizNotStartedErrorSchema = Schema.Struct({
  code: Schema.Literal("quiz_not_started"),
})

export type QuizNotStartedError = typeof quizNotStartedErrorSchema.Type
