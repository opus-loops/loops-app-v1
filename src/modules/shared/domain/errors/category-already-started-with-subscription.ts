import { Schema } from "effect"

export const categoryAlreadyStartedWithSubscriptionErrorSchema = Schema.Struct({
  code: Schema.String,
})

export type CategoryAlreadyStartedWithSubscriptionError =
  typeof categoryAlreadyStartedWithSubscriptionErrorSchema.Type
