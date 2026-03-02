import { Schema } from "effect"

export const skillAlreadyCompletedErrorSchema = Schema.Struct({
  code: Schema.Literal("skill_already_completed"),
})

export type SkillAlreadyCompletedError =
  typeof skillAlreadyCompletedErrorSchema.Type
