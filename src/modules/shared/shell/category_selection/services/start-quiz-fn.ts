import type {
  startQuizErrorsSchema,
  startQuizSuccessSchema,
} from "@/modules/shared/api/explore/quiz/start-quiz"
import { startQuizFactory } from "@/modules/shared/api/explore/quiz/start-quiz"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartQuizErrors =
  | typeof startQuizErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

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
    const isAuthenticated = userExit._tag === "Success"

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
