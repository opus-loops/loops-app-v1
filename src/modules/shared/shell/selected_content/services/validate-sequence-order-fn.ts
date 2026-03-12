import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  validateSequenceOrderArgsSchema,
  validateSequenceOrderErrorsSchema,
  validateSequenceOrderSuccessSchema,
} from "@/modules/shared/api/explore/sequence_order/validate-sequence-order"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { validateSequenceOrderFactory } from "@/modules/shared/api/explore/sequence_order/validate-sequence-order"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type ValidateSequenceOrderArgs =
  typeof validateSequenceOrderArgsSchema.Type

// --- TYPES (pure TS) ---------------------------------------------------------
export type ValidateSequenceOrderErrors =
  | { code: "Unauthorized" }
  | typeof unknownErrorSchema.Type
  | typeof validateSequenceOrderErrorsSchema.Type

export type ValidateSequenceOrderSuccess =
  typeof validateSequenceOrderSuccessSchema.Type

// JSON-safe wire union
export type ValidateSequenceOrderWire =
  | { _tag: "Failure"; error: ValidateSequenceOrderErrors }
  | { _tag: "Success"; value: ValidateSequenceOrderSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const validateSequenceOrderFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as ValidateSequenceOrderArgs)
  .handler(async (ctx): Promise<ValidateSequenceOrderWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const validateSequenceOrder = await validateSequenceOrderFactory()
    const exit = await Effect.runPromiseExit(validateSequenceOrder(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ValidateSequenceOrderWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = {
        _tag: "Failure",
        error: failure as ValidateSequenceOrderErrors,
      }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
