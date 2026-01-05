import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationManager,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"
import { SubQuizStrategySelector } from "../sub-quiz-strategy-selector"
import { ChoiceQuestionNavigationManager } from "./choice-question-navigation-manager"
import { SequenceOrderNavigationManager } from "./sequence-order-navigation-manager"

export class SubQuizNavigatorManager implements ISubQuizNavigationManager {
  private managers: Map<string, ISubQuizNavigationManager>

  constructor(
    startChoiceQuestion: ReturnType<typeof useStartChoiceQuestion>,
    startSequenceOrder: ReturnType<typeof useStartSequenceOrder>,
  ) {
    const strategySelector = new SubQuizStrategySelector(
      startChoiceQuestion,
      startSequenceOrder,
    )

    this.managers = new Map([])

    this.managers.set(
      "choice_question",
      new ChoiceQuestionNavigationManager(strategySelector),
    )

    this.managers.set(
      "sequence_order",
      new SequenceOrderNavigationManager(strategySelector),
    )

  }

  private getManager(questionType: string): ISubQuizNavigationManager | null {
    return this.managers.get(questionType) || null
  }

  canNavigateNext(context: SubQuizNavigationContext): boolean {
    const manager = this.getManager(context.currentSubQuiz.questionType)
    return manager ? manager.canNavigateNext(context) : false
  }

  canNavigatePrevious(context: SubQuizNavigationContext): boolean {
    const manager = this.getManager(context.currentSubQuiz.questionType)
    return manager ? manager.canNavigatePrevious(context) : false
  }

  navigateNext(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    const manager = this.getManager(context.currentSubQuiz.questionType)

    if (!manager) {
      return Effect.fail({
        code: "InvalidQuestionType",
        message: `No navigation manager found for question type: ${context.currentSubQuiz.questionType}`,
      })
    }

    return manager.navigateNext(context)
  }

  navigatePrevious(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    const manager = this.getManager(context.currentSubQuiz.questionType)

    if (!manager) {
      return Effect.fail({
        code: "InvalidQuestionType",
        message: `No navigation manager found for question type: ${context.currentSubQuiz.questionType}`,
      })
    }

    return manager.navigatePrevious(context)
  }
}
