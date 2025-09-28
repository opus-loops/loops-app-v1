import type {
  startDragDropErrorsSchema,
  startDragDropSuccessSchema,
} from "@/modules/shared/api/explore/drag_drop/start-drag-drop"
import { startDragDrop } from "@/modules/shared/api/explore/drag_drop/start-drag-drop"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartDragDropErrors =
  | typeof startDragDropErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartDragDropSuccess = typeof startDragDropSuccessSchema.Type

// JSON-safe wire union
export type StartDragDropWire =
  | { _tag: "Failure"; error: StartDragDropErrors }
  | { _tag: "Success"; value: StartDragDropSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startDragDropFn = createServerFn({
  method: "POST",
  response: "data",
})
  .validator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly quizId: string
        readonly questionId: string
      },
  )
  .handler(async (ctx): Promise<StartDragDropWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      startDragDrop({
        categoryId: ctx.data.categoryId,
        quizId: ctx.data.quizId,
        questionId: ctx.data.questionId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartDragDropWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message:
            "Unexpected error occurred while starting drag drop question",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
