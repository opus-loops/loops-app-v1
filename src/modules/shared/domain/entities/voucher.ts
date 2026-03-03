import { Schema } from "effect"

export const voucherSchema = Schema.Struct({
  category: Schema.String,
  code: Schema.Number.pipe(Schema.int()),
  createdAt: Schema.DateFromString,
  expiresIn: Schema.DateFromString,
  updatedAt: Schema.DateFromString,
  user: Schema.String,
  voucherId: Schema.String,
})

export type Voucher = typeof voucherSchema.Type
