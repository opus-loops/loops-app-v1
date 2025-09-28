import type {
  validateSequenceOrderArgsSchema,
  validateSequenceOrderErrorsSchema,
  validateSequenceOrderSuccessSchema,
} from "@/modules/shared/api/explore/sequence_order/validate-sequence-order"
import { validateSequenceOrder } from "@/modules/shared/api/explore/sequence_order/validate-sequence-order"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ValidateSequenceOrderErrors =
  | typeof validateSequenceOrderErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type ValidateSequenceOrderSuccess =
  typeof validateSequenceOrderSuccessSchema.Type

export type ValidateSequenceOrderArgs =
  typeof validateSequenceOrderArgsSchema.Type

// JSON-safe wire union
export type ValidateSequenceOrderWire =
  | { _tag: "Failure"; error: ValidateSequenceOrderErrors }
  | { _tag: "Success"; value: ValidateSequenceOrderSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const validateSequenceOrderFn = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data) => data as ValidateSequenceOrderArgs)
  .handler(async (ctx): Promise<ValidateSequenceOrderWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(validateSequenceOrder(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ValidateSequenceOrderWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message:
            "Unexpected error occurred while validating sequence order question",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
