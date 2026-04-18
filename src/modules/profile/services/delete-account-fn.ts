import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  DeleteAccountArgs,
  deleteAccountErrorsSchema,
  deleteAccountSuccessSchema,
} from "@/modules/shared/api/profile/delete-account"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { deleteAccountFactory } from "@/modules/shared/api/profile/delete-account"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { deleteSession } from "@/modules/shared/shell/session/session"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type DeleteAccountErrors =
  | { code: "Unauthorized" }
  | typeof deleteAccountErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type DeleteAccountSuccess = typeof deleteAccountSuccessSchema.Type

export type DeleteAccountWire =
  | { _tag: "Failure"; error: DeleteAccountErrors }
  | { _tag: "Success"; value: DeleteAccountSuccess }

export const deleteAccountFn = createServerFn({ method: "POST" })
  .inputValidator((data) => data as DeleteAccountArgs)
  .handler(async (ctx): Promise<DeleteAccountWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated) {
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }
    }

    const deleteAccount = await deleteAccountFactory()
    const exit = await Effect.runPromiseExit(deleteAccount(ctx.data))

    if (exit._tag === "Success") {
      deleteSession()
      return { _tag: "Success", value: exit.value }
    }

    const failure = handleServerFnFailure(exit.cause)

    return {
      _tag: "Failure",
      error: failure as DeleteAccountErrors,
    }
  })
