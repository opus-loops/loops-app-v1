import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import {
  logoutFactory,
  type logoutErrorsSchema,
  type logoutSuccessSchema,
} from "@/modules/shared/api/auth/logout"
import {
  deleteSession,
  getSession,
} from "@/modules/shared/shell/session/session"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

// --- TYPES ---------------------------------------------------------------
export type LogoutErrors =
  | typeof logoutErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

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
      const failure = Option.getOrElse(
        Cause.failureOption(exit.cause), //
        () => {
          return {
            code: "UnknownError" as const,
          }
        },
      )
      wire = { _tag: "Failure", error: failure }
    }

    return wire
  })
