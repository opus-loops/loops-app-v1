import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type { getCompletedChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import type { getExploreChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import type { listExploreSubQuizzesErrorsSchema } from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import type { getCompletedSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import type { getExploreSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
import type { ChoiceQuestion } from "@/modules/shared/domain/entities/choice-question"
import type { SequenceOrder } from "@/modules/shared/domain/entities/sequence-order"
import type { SubQuiz } from "@/modules/shared/domain/entities/sub-quiz"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getCompletedChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import { getExploreChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
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
  | typeof getExploreSequenceOrderErrorsSchema.Type
  | typeof listExploreSubQuizzesErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type GetQuizContentSuccess = {
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

        const completedChoiceQuestion =
          completedChoiceQuestionExit._tag === "Success"
            ? completedChoiceQuestionExit.value.completedChoiceQuestion
            : undefined

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

          if (choiceQuestionContentExit._tag === "Success") {
            choiceQuestionContent =
              choiceQuestionContentExit.value.choiceQuestion
          }
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

        const completedSequenceOrder =
          completedSequenceOrderExit._tag === "Success"
            ? completedSequenceOrderExit.value.completedSequenceOrder
            : undefined

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

          if (sequenceOrderContentExit._tag === "Success") {
            sequenceOrderContent = sequenceOrderContentExit.value.sequenceOrder
          }
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

      if (enhancedSubQuizExit._tag === "Success") {
        enhancedSubQuizzes.push(enhancedSubQuizExit.value)
      }
    }

    return {
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
    const isAuthenticated = userExit._tag === "Success"

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
