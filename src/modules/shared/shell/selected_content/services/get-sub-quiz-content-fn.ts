import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type { getExploreSubQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-sub-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getExploreSubQuizFactory } from "@/modules/shared/api/explore/quiz/get-explore-sub-quiz"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"

// --- TYPES (pure TS) ---------------------------------------------------------
export type GetSubQuizContentErrors =
  | { code: "Unauthorized" }
  | typeof getExploreSubQuizErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type GetSubQuizContentParams = {
  categoryId: string
  questionId: string
  quizId: string
}

export type GetSubQuizContentSuccess = {
  subQuiz: any // This will be the actual sub-quiz data from the API
}

export type GetSubQuizContentWire =
  | { _tag: "Failure"; error: GetSubQuizContentErrors }
  | { _tag: "Success"; value: GetSubQuizContentSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchSubQuizContentEffect = (params: GetSubQuizContentParams) =>
  Effect.gen(function* (_) {
    const { categoryId, questionId, quizId } = params

    // Fetch the sub-quiz content
    const getExploreSubQuiz = yield* _(
      Effect.promise(() => getExploreSubQuizFactory()),
    )

    const subQuizExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(
          getExploreSubQuiz({
            categoryId,
            questionId,
            quizId,
          }),
        ),
      ),
    )

    if (subQuizExit._tag === "Failure") {
      const failure = Option.getOrElse(
        Cause.failureOption(subQuizExit.cause),
        () => ({
          code: "UnknownError" as const,
        }),
      )
      return yield* Effect.fail(failure)
    }

    return { subQuiz: subQuizExit.value }
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const getSubQuizContentFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly questionId: string
        readonly quizId: string
      },
  )
  .handler(async (ctx): Promise<GetSubQuizContentWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchSubQuizContentEffect(ctx.data),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: GetSubQuizContentWire
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
