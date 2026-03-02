import { Schema } from "effect"

export const unmatchedPasswordErrorSchema = Schema.Struct({
  code: Schema.Literal("UnmatchedPassword"),
})

export type UnmatchedPasswordError = typeof unmatchedPasswordErrorSchema.Type
