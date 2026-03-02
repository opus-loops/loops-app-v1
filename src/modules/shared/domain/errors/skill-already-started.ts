import { Schema } from "effect"

export const skillAlreadyStartedErrorSchema = Schema.Struct({
  code: Schema.Literal("skill_already_started"),
})

export type SkillAlreadyStartedError =
  typeof skillAlreadyStartedErrorSchema.Type
