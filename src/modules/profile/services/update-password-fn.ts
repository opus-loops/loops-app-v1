import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  updatePasswordErrorsSchema,
  updatePasswordSuccessSchema,
} from "@/modules/shared/api/profile/update-password"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { updatePasswordFactory } from "@/modules/shared/api/profile/update-password"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { deleteSession } from "@/modules/shared/shell/session/session"

// --- TYPES (pure TS) ---------------------------------------------------------
export type UpdatePasswordErrors =
  | { code: "Unauthorized" }
  | typeof unknownErrorSchema.Type
  | typeof updatePasswordErrorsSchema.Type

export type UpdatePasswordSuccess = typeof updatePasswordSuccessSchema.Type

// JSON-safe wire union
export type UpdatePasswordWire =
  | { _tag: "Failure"; error: UpdatePasswordErrors }
  | { _tag: "Success"; value: UpdatePasswordSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const updatePasswordFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly newPassword: string
        readonly password: string
      },
  )
  .handler(async (ctx): Promise<UpdatePasswordWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const updatePassword = await updatePasswordFactory()
    const exit = await Effect.runPromiseExit(updatePassword(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: UpdatePasswordWire
    if (exit._tag === "Success") {
      deleteSession()
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
