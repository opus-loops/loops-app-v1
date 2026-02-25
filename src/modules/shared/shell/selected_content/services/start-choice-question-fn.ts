import type {
  startChoiceQuestionErrorsSchema,
  startChoiceQuestionSuccessSchema,
} from "@/modules/shared/api/explore/choice_question/start-choice-question"
import { startChoiceQuestion } from "@/modules/shared/api/explore/choice_question/start-choice-question"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartChoiceQuestionErrors =
  | typeof startChoiceQuestionErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartChoiceQuestionSuccess =
  typeof startChoiceQuestionSuccessSchema.Type

// JSON-safe wire union
export type StartChoiceQuestionWire =
  | { _tag: "Failure"; error: StartChoiceQuestionErrors }
  | { _tag: "Success"; value: StartChoiceQuestionSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startChoiceQuestionFn = createServerFn({
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
  .handler(async (ctx): Promise<StartChoiceQuestionWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      startChoiceQuestion({
        categoryId: ctx.data.categoryId,
        quizId: ctx.data.quizId,
        questionId: ctx.data.questionId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartChoiceQuestionWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error occurred while starting choice question",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
