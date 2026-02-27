import { Schema } from "effect"

// TODO: change isCompleted to status like in started-quiz
export const completedSkillSchema = Schema.Struct({
  version: Schema.Number.pipe(Schema.int()),
  user: Schema.String,
  category: Schema.String,
  skill: Schema.String,
  isCompleted: Schema.Boolean,
  passedTime: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  startedAt: Schema.DateFromString,
  endedAt: Schema.optional(Schema.DateFromString),
})

export type CompletedSkill = typeof completedSkillSchema.Type
