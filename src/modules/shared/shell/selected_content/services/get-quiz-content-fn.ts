import type { getCompletedChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import { getCompletedChoiceQuestion } from "@/modules/shared/api/explore/choice_question/get-completed-choice-question"
import type { getExploreChoiceQuestionErrorsSchema } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import { getExploreChoiceQuestion } from "@/modules/shared/api/explore/choice_question/get-explore-choice-question"
import type { listExploreSubQuizzesErrorsSchema } from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import { listExploreSubQuizzes } from "@/modules/shared/api/explore/quiz/list-explore-sub-quizzes"
import type { getCompletedSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import { getCompletedSequenceOrder } from "@/modules/shared/api/explore/sequence_order/get-completed-sequence-order"
import type { getExploreSequenceOrderErrorsSchema } from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
import { getExploreSequenceOrder } from "@/modules/shared/api/explore/sequence_order/get-explore-sequence-order"
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
): Effect.Effect<EnhancedSubQuiz, GetQuizContentErrors> => {
  const { questionId, questionType } = subQuiz

  const fetchCompletedAndContent = (): Effect.Effect<
    EnhancedSubQuiz,
    GetQuizContentErrors
  > => {
    if (questionType === "choice_question") {
      return Effect.gen(function* () {
        // Try to fetch completed choice question (optional)
        const completedChoiceQuestionExit = yield* Effect.promise(() =>
          Effect.runPromiseExit(
            getCompletedChoiceQuestion({
              categoryId,
              quizId,
              questionId,
            }),
          ),
        )

        const completedChoiceQuestion =
          completedChoiceQuestionExit._tag === "Success"
            ? completedChoiceQuestionExit.value.completedChoiceQuestion
            : undefined

        // Fetch choice question content if completed exists
        let choiceQuestionContent: ChoiceQuestion | undefined = undefined
        if (completedChoiceQuestion) {
          const choiceQuestionContentExit = yield* Effect.promise(() =>
            Effect.runPromiseExit(
              getExploreChoiceQuestion({
                categoryId,
                quizId,
                questionId,
              }),
            ),
          )

          if (choiceQuestionContentExit._tag === "Success") {
            choiceQuestionContent =
              choiceQuestionContentExit.value.choiceQuestion
          }
        }

        return {
          ...subQuiz,
          questionType: "choice_question" as const,
          completedChoiceQuestion,
          content: choiceQuestionContent,
        }
      })
    } else if (questionType === "sequence_order") {
      return Effect.gen(function* () {
        // Try to fetch completed sequence order (optional)
        const completedSequenceOrderExit = yield* Effect.promise(() =>
          Effect.runPromiseExit(
            getCompletedSequenceOrder({
              categoryId,
              quizId,
              questionId,
            }),
          ),
        )

        const completedSequenceOrder =
          completedSequenceOrderExit._tag === "Success"
            ? completedSequenceOrderExit.value.completedSequenceOrder
            : undefined

        // Fetch sequence order content if completed exists
        let sequenceOrderContent: SequenceOrder | undefined = undefined
        if (completedSequenceOrder) {
          const sequenceOrderContentExit = yield* Effect.promise(() =>
            Effect.runPromiseExit(
              getExploreSequenceOrder({
                categoryId,
                quizId,
                questionId,
              }),
            ),
          )

          if (sequenceOrderContentExit._tag === "Success") {
            sequenceOrderContent = sequenceOrderContentExit.value.sequenceOrder
          }
        }

        return {
          ...subQuiz,
          questionType: "sequence_order" as const,
          completedSequenceOrder,
          content: sequenceOrderContent,
        }
      })
    } else {
      // Return the sub quiz as is for unknown question types
      return Effect.succeed(subQuiz as EnhancedSubQuiz)
    }
  }

  return fetchCompletedAndContent()
}

const fetchQuizContentEffect = (
  categoryId: string,
  quizId: string,
): Effect.Effect<GetQuizContentSuccess, GetQuizContentErrors> =>
  Effect.gen(function* () {
    // 1) First, get all sub quizzes
    const subQuizzesExit = yield* Effect.promise(() =>
      Effect.runPromiseExit(
        listExploreSubQuizzes({
          categoryId,
          quizId,
        }),
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

    for (const subQuiz of subQuizzes) {
      const enhancedSubQuizExit = yield* Effect.promise(() =>
        Effect.runPromiseExit(
          fetchSubQuizContentEffect(categoryId, quizId, subQuiz),
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
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchQuizContentEffect(ctx.data.categoryId, ctx.data.quizId),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: GetQuizContentWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error occurred while fetching quiz content",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
