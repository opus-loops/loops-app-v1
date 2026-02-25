import type {
  submitVoucherErrorsSchema,
  submitVoucherSuccessSchema,
} from "@/modules/shared/api/voucher/submit-voucher"
import { submitVoucher } from "@/modules/shared/api/voucher/submit-voucher"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type SubmitVoucherErrors =
  | typeof submitVoucherErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type SubmitVoucherSuccess = typeof submitVoucherSuccessSchema.Type

export type SubmitVoucherWire =
  | { _tag: "Success"; value: SubmitVoucherSuccess }
  | { _tag: "Failure"; error: SubmitVoucherErrors }

// --- SERVER FUNCTION ---------------------------------------------------------
export const submitVoucherFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as { categoryId: string; code: number })
  .handler(async (ctx) => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      submitVoucher({
        categoryId: ctx.data.categoryId,
        code: ctx.data.code,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: SubmitVoucherWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
