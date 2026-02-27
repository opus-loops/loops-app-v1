import type {
  requestConfirmErrorsSchema,
  requestConfirmSuccessSchema,
} from "@/modules/shared/api/account/request-confirm"
import { requestConfirmFactory } from "@/modules/shared/api/account/request-confirm"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type RequestConfirmErrors =
  | typeof requestConfirmErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

export type RequestConfirmSuccess = typeof requestConfirmSuccessSchema.Type

// JSON-safe wire union
export type RequestConfirmWire =
  | { _tag: "Failure"; error: RequestConfirmErrors }
  | { _tag: "Success"; value: RequestConfirmSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const requestConfirmFn = createServerFn({
  method: "POST",
}).handler(async () => {
  const getLoggedUser = await getLoggedUserFactory()
  const userExit = await Effect.runPromiseExit(getLoggedUser())
  const isAuthenticated = userExit._tag === "Success"

  if (!isAuthenticated)
    return {
      _tag: "Failure",
      error: { code: "Unauthorized" as const },
    }

  // 1) Run your Effect on the server
  const requestConfirm = await requestConfirmFactory()
  const exit = await Effect.runPromiseExit(requestConfirm())

  // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
  let wire: RequestConfirmWire
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
