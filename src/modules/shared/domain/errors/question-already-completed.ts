import { Schema } from "effect"

export const questionAlreadyCompletedErrorSchema = Schema.Struct({
  code: Schema.Literal("question_already_completed"),
})

export type QuestionAlreadyCompletedError =
  typeof questionAlreadyCompletedErrorSchema.Type
