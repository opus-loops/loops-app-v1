import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  startQuizErrorsSchema,
  startQuizSuccessSchema,
} from "@/modules/shared/api/explore/quiz/start-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { startQuizFactory } from "@/modules/shared/api/explore/quiz/start-quiz"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartQuizErrors =
  | { code: "Unauthorized" }
  | typeof startQuizErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartQuizSuccess = typeof startQuizSuccessSchema.Type

// JSON-safe wire union
export type StartQuizWire =
  | { _tag: "Failure"; error: StartQuizErrors }
  | { _tag: "Success"; value: StartQuizSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startQuizFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly quizId: string
      },
  )
  .handler(async (ctx): Promise<StartQuizWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated =
      userExit._tag === "Success" && userExit.value.user !== null

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const startQuiz = await startQuizFactory()

    const exit = await Effect.runPromiseExit(
      startQuiz({
        categoryId: ctx.data.categoryId,
        quizId: ctx.data.quizId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartQuizWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as StartQuizErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
