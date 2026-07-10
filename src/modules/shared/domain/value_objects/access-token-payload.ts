import { Schema } from "effect"

/**
 * Access-token JWT payload. Dates arrive as JSON (ISO string or epoch), not Date objects.
 */
export const accessTokenPayloadSchema = Schema.Struct({
  accountCreationDate: Schema.Unknown,
  confirmationDate: Schema.optional(Schema.NullOr(Schema.Unknown)),
  permissions: Schema.Array(Schema.String),
  roleIds: Schema.Array(Schema.String),
  userId: Schema.String,
})

export type AccessTokenPayload = typeof accessTokenPayloadSchema.Type
