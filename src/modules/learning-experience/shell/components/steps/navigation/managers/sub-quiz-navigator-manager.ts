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

/**
 * Manager class responsible for handling sub-quiz navigation logic.
 * It acts as a facade, delegating the actual navigation to specific managers based on the current question type.
 * This ensures that the navigation logic is decoupled from the specific implementation details of each question type.
 */
export class SubQuizNavigatorManager implements ISubQuizNavigationManager {
  private managers: Map<string, ISubQuizNavigationManager>

  /**
   * Initializes the manager with necessary services and sets up specific managers for each question type.
   *
   * @param startChoiceQuestion - Service hook for starting choice questions
   * @param startSequenceOrder - Service hook for starting sequence order questions
   */
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
      "choiceQuestions",
      new ChoiceQuestionNavigationManager(strategySelector),
    )

    this.managers.set(
      "sequenceOrders",
      new SequenceOrderNavigationManager(strategySelector),
    )
  }

  private getManager(questionType: string): ISubQuizNavigationManager | null {
    return this.managers.get(questionType) || null
  }

  /**
   * Checks if navigation to the next sub-quiz is possible.
   * Delegates the check to the specific manager for the current question type.
   *
   * @param context - The current navigation context containing sub-quiz information
   * @returns boolean - True if navigation is possible, false otherwise
   */
  canNavigateNext(context: SubQuizNavigationContext): boolean {
    const manager = this.getManager(context.currentSubQuiz.questionType)
    return manager ? manager.canNavigateNext(context) : false
  }

  /**
   * Checks if navigation to the previous sub-quiz is possible.
   * Delegates the check to the specific manager for the current question type.
   *
   * @param context - The current navigation context containing sub-quiz information
   * @returns boolean - True if navigation is possible, false otherwise
   */
  canNavigatePrevious(context: SubQuizNavigationContext): boolean {
    const manager = this.getManager(context.currentSubQuiz.questionType)
    return manager ? manager.canNavigatePrevious(context) : false
  }

  /**
   * Executes the navigation to the next sub-quiz.
   * Delegates the execution to the specific manager for the current question type.
   *
   * @param context - The current navigation context containing sub-quiz information
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect that resolves to the next sub-quiz or fails with an error
   */
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

  /**
   * Executes the navigation to the previous sub-quiz.
   * Delegates the execution to the specific manager for the current question type.
   *
   * @param context - The current navigation context containing sub-quiz information
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect that resolves to the previous sub-quiz or fails with an error
   */
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
