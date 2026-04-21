import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type { getCompletedChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import type { getExploreChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import type { getExploreQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import type { getStartedQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import type { listExploreSubQuizzesErrorsSchema } from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import type { getCompletedSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import type { getExploreSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
import type { ChoiceQuestion } from "@/modules/shared/domain/entities/choice-question"
import type { Quiz } from "@/modules/shared/domain/entities/quiz"
import type { SequenceOrder } from "@/modules/shared/domain/entities/sequence-order"
import type { StartedQuiz } from "@/modules/shared/domain/entities/started-quiz"
import type { SubQuiz } from "@/modules/shared/domain/entities/sub-quiz"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getCompletedChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import { getExploreChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import { getExploreQuizFactory } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import { getStartedQuizFactory } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import { listExploreSubQuizzesFactory } from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import { getCompletedSequenceOrderFactory } from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import { getExploreSequenceOrderFactory } from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type GetQuizContentErrors =
  | { code: "Unauthorized" }
  | typeof getCompletedChoiceQuestionErrorsSchema.Type
  | typeof getCompletedSequenceOrderErrorsSchema.Type
  | typeof getExploreChoiceQuestionErrorsSchema.Type
  | typeof getExploreQuizErrorsSchema.Type
  | typeof getExploreSequenceOrderErrorsSchema.Type
  | typeof getStartedQuizErrorsSchema.Type
  | typeof listExploreSubQuizzesErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type GetQuizContentSuccess = {
  quiz: null | Quiz
  startedQuiz?: StartedQuiz | undefined
  subQuizzes: Array<EnhancedSubQuiz>
}

// JSON-safe wire union
export type GetQuizContentWire =
  | { _tag: "Failure"; error: GetQuizContentErrors }
  | { _tag: "Success"; value: GetQuizContentSuccess }

// --- EFFECTS (business logic) -----------------------------------------------

const fetchSubQuizContentEffect = (
  categoryId: string,
  quizId: string,
  subQuiz: SubQuiz,
  index: number,
): Effect.Effect<EnhancedSubQuiz, GetQuizContentErrors> => {
  const { questionId, questionType } = subQuiz

  const fetchCompletedAndContent = (): Effect.Effect<
    EnhancedSubQuiz,
    GetQuizContentErrors
  > => {
    if (questionType === "choiceQuestions") {
      return Effect.gen(function* (_) {
        // Try to fetch completed choice question (optional)
        const getCompletedChoiceQuestion = yield* _(
          Effect.promise(() => getCompletedChoiceQuestionFactory()),
        )

        const completedChoiceQuestionExit = yield* _(
          Effect.promise(() =>
            Effect.runPromiseExit(
              getCompletedChoiceQuestion({
                categoryId,
                questionId,
                quizId,
              }),
            ),
          ),
        )

        if (completedChoiceQuestionExit._tag === "Failure") {
          const failure = handleServerFnFailure(
            completedChoiceQuestionExit.cause,
          )
          return yield* Effect.fail(failure as GetQuizContentErrors)
        }

        const completedChoiceQuestion =
          completedChoiceQuestionExit.value.completedChoiceQuestion ?? undefined

        let choiceQuestionContent: ChoiceQuestion | undefined = undefined
        if (completedChoiceQuestion) {
          const getExploreChoiceQuestion = yield* _(
            Effect.promise(() => getExploreChoiceQuestionFactory()),
          )

          const choiceQuestionContentExit = yield* _(
            Effect.promise(() =>
              Effect.runPromiseExit(
                getExploreChoiceQuestion({
                  categoryId,
                  questionId,
                  quizId,
                }),
              ),
            ),
          )

          if (choiceQuestionContentExit._tag === "Failure") {
            const failure = handleServerFnFailure(
              choiceQuestionContentExit.cause,
            )
            return yield* Effect.fail(failure as GetQuizContentErrors)
          }

          choiceQuestionContent =
            choiceQuestionContentExit.value.choiceQuestion ?? undefined
        }

        return {
          ...subQuiz,
          completedQuestion: completedChoiceQuestion,
          content: choiceQuestionContent,
          index,
          questionType: "choiceQuestions" as const,
        }
      })
    } else if (questionType === "sequenceOrders") {
      return Effect.gen(function* (_) {
        // Try to fetch completed sequence order (optional)
        const getCompletedSequenceOrder = yield* _(
          Effect.promise(() => getCompletedSequenceOrderFactory()),
        )

        const completedSequenceOrderExit = yield* _(
          Effect.promise(() =>
            Effect.runPromiseExit(
              getCompletedSequenceOrder({
                categoryId,
                questionId,
                quizId,
              }),
            ),
          ),
        )

        if (completedSequenceOrderExit._tag === "Failure") {
          const failure = handleServerFnFailure(
            completedSequenceOrderExit.cause,
          )
          return yield* Effect.fail(failure as GetQuizContentErrors)
        }

        const completedSequenceOrder =
          completedSequenceOrderExit.value.completedSequenceOrder ?? undefined

        // Fetch sequence order content if completed exists
        let sequenceOrderContent: SequenceOrder | undefined = undefined
        if (completedSequenceOrder) {
          const getExploreSequenceOrder = yield* _(
            Effect.promise(() => getExploreSequenceOrderFactory()),
          )

          const sequenceOrderContentExit = yield* _(
            Effect.promise(() =>
              Effect.runPromiseExit(
                getExploreSequenceOrder({
                  categoryId,
                  questionId,
                  quizId,
                }),
              ),
            ),
          )

          if (sequenceOrderContentExit._tag === "Failure") {
            const failure = handleServerFnFailure(
              sequenceOrderContentExit.cause,
            )
            return yield* Effect.fail(failure as GetQuizContentErrors)
          }

          sequenceOrderContent =
            sequenceOrderContentExit.value.sequenceOrder ?? undefined
        }

        return {
          ...subQuiz,
          completedQuestion: completedSequenceOrder,
          content: sequenceOrderContent,
          index,
          questionType: "sequenceOrders" as const,
        }
      })
    } else {
      // Return the sub quiz as is for unknown question types, but add the index
      return Effect.succeed({
        ...subQuiz,
        index,
      } as EnhancedSubQuiz)
    }
  }

  return fetchCompletedAndContent()
}

const fetchQuizContentEffect = (
  categoryId: string,
  quizId: string,
): Effect.Effect<GetQuizContentSuccess, GetQuizContentErrors> =>
  Effect.gen(function* (_) {
    const getExploreQuiz = yield* _(
      Effect.promise(() => getExploreQuizFactory()),
    )

    const quizExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(
          getExploreQuiz({
            categoryId,
            quizId,
          }),
        ),
      ),
    )

    if (quizExit._tag === "Failure") {
      const failure = handleServerFnFailure(quizExit.cause)
      return yield* Effect.fail(failure as GetQuizContentErrors)
    }

    const { quiz } = quizExit.value

    if (quiz === null) return { quiz, subQuizzes: [] }

    const getStartedQuiz = yield* _(
      Effect.promise(() => getStartedQuizFactory()),
    )

    const startedQuizExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(
          getStartedQuiz({
            categoryId,
            quizId,
          }),
        ),
      ),
    )

    if (startedQuizExit._tag === "Failure") {
      const failure = handleServerFnFailure(startedQuizExit.cause)
      return yield* Effect.fail(failure as GetQuizContentErrors)
    }

    const startedQuiz = startedQuizExit.value.startedQuiz ?? undefined

    // 1) First, get all sub quizzes
    const listExploreSubQuizzes = yield* _(
      Effect.promise(() => listExploreSubQuizzesFactory()),
    )

    const subQuizzesExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(
          listExploreSubQuizzes({
            categoryId,
            quizId,
          }),
        ),
      ),
    )

    if (subQuizzesExit._tag === "Failure") {
      const failure = handleServerFnFailure(subQuizzesExit.cause)
      return yield* Effect.fail(failure as GetQuizContentErrors)
    }

    const { subQuizzes } = subQuizzesExit.value

    // 2) For each sub quiz, fetch its completed status and content
    const enhancedSubQuizzes: Array<EnhancedSubQuiz> = []

    let index = 0
    for (const subQuiz of subQuizzes) {
      const enhancedSubQuizExit = yield* _(
        Effect.promise(() =>
          Effect.runPromiseExit(
            fetchSubQuizContentEffect(categoryId, quizId, subQuiz, index++),
          ),
        ),
      )

      if (enhancedSubQuizExit._tag === "Failure") {
        const failure = handleServerFnFailure(enhancedSubQuizExit.cause)
        return yield* Effect.fail(failure as GetQuizContentErrors)
      }

      enhancedSubQuizzes.push(enhancedSubQuizExit.value)
    }

    return {
      quiz,
      startedQuiz,
      subQuizzes: enhancedSubQuizzes,
    }
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const getQuizContentFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly quizId: string
      },
  )
  .handler(async (ctx): Promise<GetQuizContentWire> => {
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
    const exit = await Effect.runPromiseExit(
      fetchQuizContentEffect(ctx.data.categoryId, ctx.data.quizId),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: GetQuizContentWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as GetQuizContentErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
