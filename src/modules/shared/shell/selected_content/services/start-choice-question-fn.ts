import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  startChoiceQuestionErrorsSchema,
  startChoiceQuestionSuccessSchema,
} from "@/modules/shared/api/explore/choice_question/start-choice-question"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { startChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/start-choice-question"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartChoiceQuestionErrors =
  | { code: "Unauthorized" }
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
        readonly questionId: string
        readonly quizId: string
      },
  )
  .handler(async (ctx): Promise<StartChoiceQuestionWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const startChoiceQuestion = await startChoiceQuestionFactory()

    const exit = await Effect.runPromiseExit(
      startChoiceQuestion({
        categoryId: ctx.data.categoryId,
        questionId: ctx.data.questionId,
        quizId: ctx.data.quizId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartChoiceQuestionWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as StartChoiceQuestionErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
