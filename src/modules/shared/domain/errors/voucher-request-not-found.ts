import { Schema } from "effect"

export const voucherRequestNotFoundErrorSchema = Schema.Struct({
  code: Schema.Literal("voucher_request_not_found"),
})

export type VoucherRequestNotFoundError =
  typeof voucherRequestNotFoundErrorSchema.Type
