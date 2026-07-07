import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  getVoucherRequestErrorsSchema,
  getVoucherRequestSuccessSchema,
} from "@/modules/shared/api/voucher-request/get-voucher-request"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { getVoucherRequestFactory } from "@/modules/shared/api/voucher-request/get-voucher-request"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type GetVoucherRequestErrors =
  | { code: "Unauthorized" }
  | typeof getVoucherRequestErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type GetVoucherRequestSuccess =
  typeof getVoucherRequestSuccessSchema.Type

export type GetVoucherRequestWire =
  | { _tag: "Failure"; error: GetVoucherRequestErrors }
  | { _tag: "Success"; value: GetVoucherRequestSuccess }

export const getVoucherRequestFn = createServerFn({
  method: "GET",
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

    const getVoucherRequest = await getVoucherRequestFactory()
    const exit = await Effect.runPromiseExit(
      getVoucherRequest({ categoryId: ctx.data.categoryId }),
    )

    if (exit._tag === "Success") {
      return { _tag: "Success", value: exit.value }
    }

    const failure = handleServerFnFailure(exit.cause)
    return {
      _tag: "Failure",
      error: failure as GetVoucherRequestErrors,
    }
  })
