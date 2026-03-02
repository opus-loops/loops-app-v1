import { Schema } from "effect"

export const categoryAlreadyStartedErrorSchema = Schema.Struct({
  code: Schema.Literal("category_already_started"),
})

export type CategoryAlreadyStartedError =
  typeof categoryAlreadyStartedErrorSchema.Type
