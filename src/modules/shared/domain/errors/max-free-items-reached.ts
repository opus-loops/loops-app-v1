import { Schema } from "effect"

export const maxFreeItemsReachedErrorSchema = Schema.Struct({
  code: Schema.Literal("max_free_items_reached"),
})

export type MaxFreeItemsReachedError =
  typeof maxFreeItemsReachedErrorSchema.Type
