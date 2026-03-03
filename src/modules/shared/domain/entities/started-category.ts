import { Schema } from "effect"

export const startedCategorySchema = Schema.Struct({
  category: Schema.String,
  completedItemsCount: Schema.Number.pipe(Schema.int()),
  createdAt: Schema.DateFromString,
  hasSubscription: Schema.Boolean,
  progressPointer: Schema.optional(Schema.String),
  score: Schema.Number.pipe(Schema.int()),
  status: Schema.String,
  totalTime: Schema.Number.pipe(Schema.int()),
  updatedAt: Schema.DateFromString,
  user: Schema.String,
})

export type StartedCategory = typeof startedCategorySchema.Type
