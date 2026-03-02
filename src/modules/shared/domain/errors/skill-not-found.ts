import { Schema } from "effect"

export const skillNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("skill_not_found"),
})

export type SkillNotFoundError = typeof skillNotFoundErrorSchema.Type
