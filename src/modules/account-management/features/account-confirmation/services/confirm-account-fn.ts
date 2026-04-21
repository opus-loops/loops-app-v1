import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  confirmAccountErrorsSchema,
  confirmAccountSuccessSchema,
} from "@/modules/shared/api/account/confirm-account"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { confirmAccountFactory } from "@/modules/shared/api/account/confirm-account"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ConfirmAccountErrors =
  | { code: "Unauthorized" }
  | typeof confirmAccountErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type ConfirmAccountSuccess = typeof confirmAccountSuccessSchema.Type

// JSON-safe wire union
export type ConfirmAccountWire =
  | { _tag: "Failure"; error: ConfirmAccountErrors }
  | { _tag: "Success"; value: ConfirmAccountSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const confirmAccountFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as { confirmationCode: number })
  .handler(async (ctx) => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated =
      userExit._tag === "Success" && userExit.value.user !== null

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const confirmAccount = await confirmAccountFactory()

    const exit = await Effect.runPromiseExit(
      confirmAccount({
        confirmationCode: ctx.data.confirmationCode,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ConfirmAccountWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as ConfirmAccountErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
