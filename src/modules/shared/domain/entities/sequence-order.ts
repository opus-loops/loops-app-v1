import { Schema } from "effect"
import { textContentSchema } from "../value_objects/text-content"

export const sequenceOrderSchema = Schema.Struct({
  version: Schema.Number.pipe(Schema.int()),
  sequenceOrder: Schema.String,
  headline: Schema.Array(textContentSchema),
  sequence: Schema.Array(Schema.Array(textContentSchema)),
  metaTags: Schema.Array(Schema.String),
  idealOrder: Schema.optional(Schema.Array(Schema.Number.pipe(Schema.int()))),
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  estimatedTime: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  createdAt: Schema.DateFromString,
})

export type SequenceOrder = typeof sequenceOrderSchema.Type
