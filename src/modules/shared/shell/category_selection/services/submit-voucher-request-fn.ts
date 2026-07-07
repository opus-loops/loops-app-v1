import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  submitVoucherRequestErrorsSchema,
  submitVoucherRequestSuccessSchema,
} from "@/modules/shared/api/voucher-request/submit-voucher-request"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { submitVoucherRequestFactory } from "@/modules/shared/api/voucher-request/submit-voucher-request"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type SubmitVoucherRequestErrors =
  | { code: "Unauthorized" }
  | typeof submitVoucherRequestErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type SubmitVoucherRequestSuccess =
  typeof submitVoucherRequestSuccessSchema.Type

export type SubmitVoucherRequestWire =
  | { _tag: "Failure"; error: SubmitVoucherRequestErrors }
  | { _tag: "Success"; value: SubmitVoucherRequestSuccess }

export const submitVoucherRequestFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as { categoryId: string })
  .handler(async (ctx) => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated =
      userExit._tag === "Success" && userExit.value.user !== null

    if (!isAuthenticated) {
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }
    }

    const submitVoucherRequest = await submitVoucherRequestFactory()
    const exit = await Effect.runPromiseExit(
      submitVoucherRequest({ categoryId: ctx.data.categoryId }),
    )

    if (exit._tag === "Success") {
      return { _tag: "Success", value: exit.value }
    }

    const failure = handleServerFnFailure(exit.cause)
    return {
      _tag: "Failure",
      error: failure as SubmitVoucherRequestErrors,
    }
  })
