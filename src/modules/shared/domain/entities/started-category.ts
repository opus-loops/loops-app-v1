import { Schema } from "effect"

export const startedCategorySchema = Schema.Struct({
  category: Schema.String,
  user: Schema.String,
  hasSubscription: Schema.Boolean,
  completedItemsCount: Schema.Number.pipe(Schema.int()),
  score: Schema.Number.pipe(Schema.int()),
  totalTime: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  createdAt: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
  progressPointer: Schema.optional(Schema.String),
})

export type StartedCategory = typeof startedCategorySchema.Type
