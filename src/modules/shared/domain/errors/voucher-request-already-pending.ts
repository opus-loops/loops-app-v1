import { Schema } from "effect"

export const voucherRequestAlreadyPendingErrorSchema = Schema.Struct({
  code: Schema.Literal("voucher_request_already_pending"),
})

export type VoucherRequestAlreadyPendingError =
  typeof voucherRequestAlreadyPendingErrorSchema.Type
