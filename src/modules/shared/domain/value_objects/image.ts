import { Schema } from "effect"

export const imageSchema = Schema.Struct({
  alt: Schema.String,
  title: Schema.String,
  description: Schema.String,
  urls: Schema.NullOr(
    Schema.Struct({
      100: Schema.String,
      80: Schema.String,
      60: Schema.String,
      40: Schema.String,
      20: Schema.String,
    }),
  ),
})

export type Image = typeof imageSchema.Type
