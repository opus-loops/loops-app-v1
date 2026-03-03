import { Schema } from "effect"

export const certificateSchema = Schema.Struct({
  category: Schema.String,
  createdAt: Schema.DateFromString,
  pdfURL: Schema.String,
  user: Schema.String,
})

export type Certificate = typeof certificateSchema.Type
