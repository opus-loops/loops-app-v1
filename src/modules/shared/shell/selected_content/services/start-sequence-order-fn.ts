import type {
  startSequenceOrderErrorsSchema,
  startSequenceOrderSuccessSchema,
} from "@/modules/shared/api/explore/sequence_order/start-sequence-order"
import { startSequenceOrder } from "@/modules/shared/api/explore/sequence_order/start-sequence-order"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartSequenceOrderErrors =
  | typeof startSequenceOrderErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartSequenceOrderSuccess =
  typeof startSequenceOrderSuccessSchema.Type

// JSON-safe wire union
export type StartSequenceOrderWire =
  | { _tag: "Failure"; error: StartSequenceOrderErrors }
  | { _tag: "Success"; value: StartSequenceOrderSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startSequenceOrderFn = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly quizId: string
        readonly questionId: string
      },
  )
  .handler(async (ctx): Promise<StartSequenceOrderWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      startSequenceOrder({
        categoryId: ctx.data.categoryId,
        quizId: ctx.data.quizId,
        questionId: ctx.data.questionId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartSequenceOrderWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message:
            "Unexpected error occurred while starting sequence order question",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
