import type {
  requestConfirmErrorsSchema,
  requestConfirmSuccessSchema,
} from "@/modules/shared/api/account/request-confirm"
import { requestConfirm } from "@/modules/shared/api/account/request-confirm"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type RequestConfirmErrors =
  | typeof requestConfirmErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type RequestConfirmSuccess = typeof requestConfirmSuccessSchema.Type

// JSON-safe wire union
export type RequestConfirmWire =
  | { _tag: "Failure"; error: RequestConfirmErrors }
  | { _tag: "Success"; value: RequestConfirmSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const requestConfirmFn = createServerFn({
  method: "POST",
}).handler(async () => {
  // 1) Run your Effect on the server
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
