import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  logoutErrorsSchema,
  logoutSuccessSchema,
} from "@/modules/shared/api/auth/logout"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { logoutFactory } from "@/modules/shared/api/auth/logout"
import {
  deleteSession,
  getSession,
} from "@/modules/shared/shell/session/session"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES ---------------------------------------------------------------
export type LogoutErrors =
  | { code: "Unauthorized" }
  | typeof logoutErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type LogoutSuccess = typeof logoutSuccessSchema.Type

export type LogoutWire =
  | { _tag: "Failure"; error: LogoutErrors }
  | { _tag: "Success"; value: LogoutSuccess }

// --- SERVER FUNCTION -----------------------------------------------------
export const logoutFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => data as undefined)
  .handler(async () => {
    // Get session to extract refresh token
    const session = await getSession()

    // If no session, return a generic error
    if (!session) {
      const wire: LogoutWire = {
        _tag: "Failure",
        error: {
          code: "Unauthorized",
        },
      }
      return wire
    }

    const logout = await logoutFactory()
    const exit = await Effect.runPromiseExit(
      logout({ refreshToken: session.refreshToken }),
    )

    let wire: LogoutWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
      // Clear server-side session cookie
      deleteSession()
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as LogoutErrors }
    }

    return wire
  })
