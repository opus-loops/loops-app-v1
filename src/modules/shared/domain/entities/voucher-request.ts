import { Schema } from "effect"

export const voucherRequestStatusSchema = Schema.Literal(
  "pending",
  "accepted",
  "rejected",
)

export const voucherRequestSchema = Schema.Struct({
  categoryId: Schema.String,
  createdAt: Schema.DateFromString,
  rejectedReason: Schema.optional(Schema.String),
  reviewedAt: Schema.optional(Schema.DateFromString),
  reviewedBy: Schema.optional(Schema.String),
  status: voucherRequestStatusSchema,
  updatedAt: Schema.DateFromString,
  userId: Schema.String,
  voucherRequestId: Schema.String,
})

export type VoucherRequest = typeof voucherRequestSchema.Type
