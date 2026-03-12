import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type { getExploreSubQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-sub-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getExploreSubQuizFactory } from "@/modules/shared/api/explore/quiz/get-explore-sub-quiz"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

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
      const failure = handleServerFnFailure(subQuizExit.cause)
      return yield* Effect.fail(failure as GetSubQuizContentErrors)
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
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as GetSubQuizContentErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
