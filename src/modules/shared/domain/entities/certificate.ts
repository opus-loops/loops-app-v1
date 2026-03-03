import { Schema } from "effect"

export const certificateSchema = Schema.Struct({
  user: Schema.String,
  category: Schema.String,
  pdfURL: Schema.String,
  imageURL: Schema.String,
  createdAt: Schema.DateFromString,
})

export type Certificate = typeof certificateSchema.Type
