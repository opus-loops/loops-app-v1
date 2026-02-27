import type {
  confirmAccountErrorsSchema,
  confirmAccountSuccessSchema,
} from "@/modules/shared/api/account/confirm-account"
import { confirmAccountFactory } from "@/modules/shared/api/account/confirm-account"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ConfirmAccountErrors =
  | typeof confirmAccountErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

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
    const isAuthenticated = userExit._tag === "Success"

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
