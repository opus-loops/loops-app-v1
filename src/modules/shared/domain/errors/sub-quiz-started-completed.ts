import { Schema } from "effect"

export const subQuizStartedCompletedErrorSchema = Schema.Struct({
  code: Schema.Literal("sub_quiz_started_completed"),
})

export type SubQuizStartedCompletedError =
  typeof subQuizStartedCompletedErrorSchema.Type
