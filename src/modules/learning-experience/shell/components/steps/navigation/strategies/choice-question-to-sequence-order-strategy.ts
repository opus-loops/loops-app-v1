import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationStrategy,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"

/**
 * Navigation strategy for transitioning from a Choice Question to a Sequence Order Question.
 * Handles the logic for validating the current question's completion and starting the next sequence order question.
 */
export class ChoiceQuestionToSequenceOrderStrategy implements ISubQuizNavigationStrategy {
  /**
   * Initializes the strategy with the service to start sequence order questions.
   *
   * @param startSequenceOrder - Service hook for starting sequence order questions
   */
  constructor(
    private startSequenceOrder: ReturnType<typeof useStartSequenceOrder>,
  ) {}

  /**
   * Checks if navigation is possible.
   * Requires an adjacent sub-quiz to exist and the current question to be completed.
   *
   * @param context - The current navigation context
   * @returns boolean - True if navigation is allowed, false otherwise
   */
  canNavigate(context: SubQuizNavigationContext): boolean {
    return (
      context.adjacentSubQuiz !== undefined &&
      this.validateCompletion(context.currentSubQuiz)
    )
  }

  /**
   * Validates if the current sub-quiz is completed.
   * Checks if the question type matches and if the status is marked as completed.
   *
   * @param subQuiz - The sub-quiz to validate
   * @returns boolean - True if the sub-quiz is a completed choice question
   */
  validateCompletion(subQuiz: EnhancedSubQuiz): boolean {
    return (
      subQuiz.questionType === "choiceQuestions" &&
      subQuiz.completedQuestion !== undefined &&
      subQuiz.completedQuestion.status === "completed"
    )
  }

  /**
   * Executes the navigation to the next sequence order question.
   * Starts the next question via the service and returns the adjacent sub-quiz.
   *
   * @param context - The current navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect that resolves to the next sub-quiz or fails with an error
   */
  navigate(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    if (!context.adjacentSubQuiz) {
      return Effect.fail({
        code: "NoNextSubQuiz",
        message: "No adjacent sub quiz found",
      })
    }

    return Effect.tryPromise({
      try: async () => {
        await this.startSequenceOrder.handleStartSequenceOrder({
          categoryId: context.categoryId,
          quizId: context.adjacentSubQuiz!.quizId,
          questionId: context.adjacentSubQuiz!.questionId,
        })
        return context.adjacentSubQuiz!
      },
      catch: () => ({
        code: "FetchError" as const,
        message: "Failed to start sequence order",
      }),
    })
  }
}
