import { Schema } from "effect"

export const previousQuestionNotCompletedErrorSchema = Schema.Struct({
  code: Schema.Literal("previous_question_not_completed"),
})

export type PreviousQuestionNotCompletedError =
  typeof previousQuestionNotCompletedErrorSchema.Type
