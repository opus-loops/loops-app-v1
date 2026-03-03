import { Schema } from "effect"

import { textContentSchema } from "../value_objects/text-content"

export const sequenceOrderSchema = Schema.Struct({
  congratulatoryMessage: Schema.Array(textContentSchema),
  consolidationMessage: Schema.Array(textContentSchema),
  createdAt: Schema.DateFromString,
  defaultLanguage: Schema.String,
  difficulty: Schema.Number.pipe(Schema.int()),
  estimatedTime: Schema.Number.pipe(Schema.int()),
  headline: Schema.Array(textContentSchema),
  idealOrder: Schema.optional(Schema.Array(Schema.Number.pipe(Schema.int()))),
  metaTags: Schema.Array(Schema.String),
  score: Schema.Number.pipe(Schema.int()),
  sequence: Schema.Array(Schema.Array(textContentSchema)),
  sequenceOrder: Schema.String,
  status: Schema.String,
  version: Schema.Number.pipe(Schema.int()),
})

export type SequenceOrder = typeof sequenceOrderSchema.Type
