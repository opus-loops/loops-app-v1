import { Schema } from "effect"

// TODO: change isCompleted to status like in started-quiz
export const completedSkillSchema = Schema.Struct({
  category: Schema.String,
  endedAt: Schema.optional(Schema.DateFromString),
  isCompleted: Schema.Boolean,
  passedTime: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  skill: Schema.String,
  startedAt: Schema.DateFromString,
  user: Schema.String,
  version: Schema.Number.pipe(Schema.int()),
})

export type CompletedSkill = typeof completedSkillSchema.Type
