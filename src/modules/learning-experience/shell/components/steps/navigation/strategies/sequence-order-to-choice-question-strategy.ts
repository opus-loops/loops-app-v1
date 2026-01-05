import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationStrategy,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"

export class SequenceOrderToChoiceQuestionStrategy
  implements ISubQuizNavigationStrategy
{
  constructor(
    private startChoiceQuestion: ReturnType<typeof useStartChoiceQuestion>,
  ) {}

  canNavigate(context: SubQuizNavigationContext): boolean {
    return (
      context.adjacentSubQuiz !== undefined &&
      this.validateCompletion(context.currentSubQuiz)
    )
  }

  validateCompletion(subQuiz: EnhancedSubQuiz): boolean {
    return (
      subQuiz.questionType === "sequence_order" &&
      subQuiz.completedSequenceOrder !== undefined &&
      subQuiz.completedSequenceOrder.status === "completed"
    )
  }

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
        await this.startChoiceQuestion.handleStartChoiceQuestion({
          categoryId: context.categoryId,
          quizId: context.adjacentSubQuiz!.quizId,
          questionId: context.adjacentSubQuiz!.subQuizId,
        })
        return context.adjacentSubQuiz!
      },
      catch: () => ({
        code: "FetchError" as const,
        message: "Failed to start choice question",
      }),
    })
  }
}