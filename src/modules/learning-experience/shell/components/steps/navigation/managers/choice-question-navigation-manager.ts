import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationManager,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"
import { SubQuizStrategySelector } from "../sub-quiz-strategy-selector"

/**
 * Navigation manager specifically for Choice Questions.
 * Handles validation and navigation logic when the current sub-quiz is a choice question.
 * Uses the strategy selector to determine the appropriate navigation strategy.
 */
export class ChoiceQuestionNavigationManager
  implements ISubQuizNavigationManager
{
  /**
   * Initializes the manager with the strategy selector.
   *
   * @param strategySelector - Selector to retrieve the navigation strategy
   */
  constructor(private strategySelector: SubQuizStrategySelector) {}

  /**
   * Checks if navigation to the next sub-quiz is possible.
   * Uses the selected strategy to determine if navigation is allowed.
   *
   * @param context - The current navigation context
   * @returns boolean - True if navigation is possible, false otherwise
   */
  canNavigateNext(context: SubQuizNavigationContext): boolean {
    const self = this
    return Effect.runSync(
      Effect.gen(function* () {
        const strategy = yield* self.strategySelector.getStrategy(context)
        return strategy.canNavigate(context)
      }).pipe(Effect.catchAll(() => Effect.succeed(false))),
    )
  }

  /**
   * Checks if navigation to the previous sub-quiz is possible.
   * For choice questions, previous navigation is allowed if there is an adjacent sub-quiz.
   *
   * @param context - The current navigation context
   * @returns boolean - True if navigation is possible, false otherwise
   */
  canNavigatePrevious(context: SubQuizNavigationContext): boolean {
    return context.adjacentSubQuiz !== undefined
  }

  /**
   * Executes the navigation to the next sub-quiz.
   * Retrieves the appropriate strategy and executes its navigation logic.
   * Fails if navigation is not allowed by the strategy.
   *
   * @param context - The current navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect that resolves to the next sub-quiz or fails with an error
   */
  navigateNext(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    const self = this
    return Effect.gen(function* () {
      const strategy = yield* self.strategySelector.getStrategy(context)
      if (!strategy.canNavigate(context)) {
        return yield* Effect.fail({
          code: "NavigationNotAllowed" as const,
          message: "Navigation not allowed",
        })
      }
      return yield* strategy.navigate(context)
    })
  }

  /**
   * Executes the navigation to the previous sub-quiz.
   * Simply returns the adjacent sub-quiz if it exists, as no specific validation is needed for previous navigation in this context.
   *
   * @param context - The current navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect that resolves to the previous sub-quiz or fails with an error
   */
  navigatePrevious(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    if (!context.adjacentSubQuiz) {
      return Effect.fail({
        code: "NoPreviousSubQuiz",
        message: "No previous sub quiz found",
      })
    }
    return Effect.succeed(context.adjacentSubQuiz)
  }
}
