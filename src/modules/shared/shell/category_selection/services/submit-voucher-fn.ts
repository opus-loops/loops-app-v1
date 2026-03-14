import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  submitVoucherErrorsSchema,
  submitVoucherSuccessSchema,
} from "@/modules/shared/api/voucher/submit-voucher"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { submitVoucherFactory } from "@/modules/shared/api/voucher/submit-voucher"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type SubmitVoucherErrors =
  | { code: "Unauthorized" }
  | typeof submitVoucherErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type SubmitVoucherSuccess = typeof submitVoucherSuccessSchema.Type

export type SubmitVoucherWire =
  | { _tag: "Failure"; error: SubmitVoucherErrors }
  | { _tag: "Success"; value: SubmitVoucherSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const submitVoucherFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as { categoryId: string; code: number })
  .handler(async (ctx) => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const submitVoucher = await submitVoucherFactory()

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
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as SubmitVoucherErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
