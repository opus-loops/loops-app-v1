import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationStrategy,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"

export class ChoiceQuestionToSequenceOrderStrategy
  implements ISubQuizNavigationStrategy
{
  constructor(
    private startSequenceOrder: ReturnType<typeof useStartSequenceOrder>,
  ) {}

  canNavigate(context: SubQuizNavigationContext): boolean {
    return (
      context.adjacentSubQuiz !== undefined &&
      this.validateCompletion(context.currentSubQuiz)
    )
  }

  validateCompletion(subQuiz: EnhancedSubQuiz): boolean {
    return (
      subQuiz.questionType === "choice_question" &&
      subQuiz.completedChoiceQuestion !== undefined &&
      subQuiz.completedChoiceQuestion.status === "completed"
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
        await this.startSequenceOrder.handleStartSequenceOrder({
          categoryId: context.categoryId,
          quizId: context.adjacentSubQuiz!.quizId,
          questionId: context.adjacentSubQuiz!.subQuizId,
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