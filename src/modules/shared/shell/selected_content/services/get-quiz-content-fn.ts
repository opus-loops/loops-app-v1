import type { getCompletedChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import { getCompletedChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import type { getExploreChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import { getExploreChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import {
  listExploreSubQuizzesFactory,
  type listExploreSubQuizzesErrorsSchema,
} from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import {
  getCompletedSequenceOrderFactory,
  type getCompletedSequenceOrderErrorsSchema,
} from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import {
  getExploreSequenceOrderFactory,
  type getExploreSequenceOrderErrorsSchema,
} from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { ChoiceQuestion } from "@/modules/shared/domain/entities/choice-question"
import { SequenceOrder } from "@/modules/shared/domain/entities/sequence-order"
import { SubQuiz } from "@/modules/shared/domain/entities/sub-quiz"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type GetQuizContentErrors =
  | typeof listExploreSubQuizzesErrorsSchema.Type
  | typeof getCompletedChoiceQuestionErrorsSchema.Type
  | typeof getExploreChoiceQuestionErrorsSchema.Type
  | typeof getCompletedSequenceOrderErrorsSchema.Type
  | typeof getExploreSequenceOrderErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

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
                quizId,
                questionId,
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
                  quizId,
                  questionId,
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
          questionType: "choiceQuestions" as const,
          completedQuestion: completedChoiceQuestion,
          content: choiceQuestionContent,
          index,
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
                quizId,
                questionId,
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
                  quizId,
                  questionId,
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
          questionType: "sequenceOrders" as const,
          completedQuestion: completedSequenceOrder,
          content: sequenceOrderContent,
          index,
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
      const failure = Option.getOrElse(
        Cause.failureOption(subQuizzesExit.cause),
        () => ({
          code: "UnknownError" as const,
          message: "Failed to fetch sub quizzes",
        }),
      )
      return yield* Effect.fail(failure)
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
      const failure = Option.getOrElse(
        Cause.failureOption(exit.cause), //
        () => {
          // Fallback if you sometimes throw defects: map to a typed error variant in your union
          return {
            code: "UnknownError" as const,
            message: "Unexpected error occurred while fetching quiz content",
          }
        },
      )
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
