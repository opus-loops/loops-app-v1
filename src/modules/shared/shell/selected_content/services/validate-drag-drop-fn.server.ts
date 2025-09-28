import type {
  validateDragDropArgsSchema,
  validateDragDropErrorsSchema,
  validateDragDropSuccessSchema,
} from "@/modules/shared/api/explore/drag_drop/validate-drag-drop"
import { validateDragDrop } from "@/modules/shared/api/explore/drag_drop/validate-drag-drop"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ValidateDragDropErrors =
  | typeof validateDragDropErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type ValidateDragDropSuccess = typeof validateDragDropSuccessSchema.Type

export type ValidateDragDropArgs = typeof validateDragDropArgsSchema.Type

// JSON-safe wire union
export type ValidateDragDropWire =
  | { _tag: "Failure"; error: ValidateDragDropErrors }
  | { _tag: "Success"; value: ValidateDragDropSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const validateDragDropFn = createServerFn({
  method: "POST",
  response: "data",
})
  .validator((data) => data as ValidateDragDropArgs)
  .handler(async (ctx): Promise<ValidateDragDropWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(validateDragDrop(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ValidateDragDropWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message:
            "Unexpected error occurred while validating drag drop question",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
