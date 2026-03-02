import { Schema } from "effect"

export const invalidFileErrorSchema = Schema.Struct({
  code: Schema.Literal("invalid_file"),
})

export type InvalidFileError = typeof invalidFileErrorSchema.Type
