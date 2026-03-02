import { Schema } from "effect"

export const skillNotCompletedErrorSchema = Schema.Struct({
  code: Schema.Literal("skill_not_completed"),
})

export type SkillNotCompletedError = typeof skillNotCompletedErrorSchema.Type
