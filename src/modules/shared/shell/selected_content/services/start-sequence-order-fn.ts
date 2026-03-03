import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  startSequenceOrderErrorsSchema,
  startSequenceOrderSuccessSchema,
} from "@/modules/shared/api/explore/sequence_order/start-sequence-order"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { startSequenceOrderFactory } from "@/modules/shared/api/explore/sequence_order/start-sequence-order"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartSequenceOrderErrors =
  | { code: "Unauthorized" }
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
        readonly questionId: string
        readonly quizId: string
      },
  )
  .handler(async (ctx): Promise<StartSequenceOrderWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const startSequenceOrder = await startSequenceOrderFactory()
    const exit = await Effect.runPromiseExit(
      startSequenceOrder({
        categoryId: ctx.data.categoryId,
        questionId: ctx.data.questionId,
        quizId: ctx.data.quizId,
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
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
