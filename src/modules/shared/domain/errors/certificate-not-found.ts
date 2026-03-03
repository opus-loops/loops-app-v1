import { Schema } from "effect"

export const certificateNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("certificate_not_found"),
})

export type CertificateNotFoundError = typeof certificateNotFoundErrorSchema.Type
