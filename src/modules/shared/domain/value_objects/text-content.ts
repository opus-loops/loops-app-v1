import { Schema } from "effect"

export const textContentSchema = Schema.Struct({
  content: Schema.String,
  language: Schema.String,
})

export type TextContent = typeof textContentSchema.Type
