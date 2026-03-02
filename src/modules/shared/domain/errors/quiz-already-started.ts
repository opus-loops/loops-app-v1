import { Schema } from "effect"

export const quizAlreadyStartedErrorSchema = Schema.Struct({
  code: Schema.Literal("quiz_already_started"),
})

export type QuizAlreadyStartedError = typeof quizAlreadyStartedErrorSchema.Type
