import { Schema } from "effect"

export const resourceAccessForbiddenErrorSchema = Schema.Struct({
  code: Schema.Literal("resource_access_forbidden"),
  status: Schema.Literal(403),
})

export type ResourceAccessForbiddenError =
  typeof resourceAccessForbiddenErrorSchema.Type
