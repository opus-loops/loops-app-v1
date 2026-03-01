import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"

/**
 * Represents possible errors that can occur during sub-quiz navigation.
 * Using a discriminated union allows for type-safe error handling.
 */
export type SubQuizNavigationError =
  | { readonly code: "NoNextSubQuiz"; readonly message: string }
  | { readonly code: "NoPreviousSubQuiz"; readonly message: string }
  | { readonly code: "CompletionRequired"; readonly message: string }
  | { readonly code: "ValidationFailed"; readonly message: string }
  | { readonly code: "InvalidQuestionType"; readonly message: string }
  | { readonly code: "FetchError"; readonly message: string }
  | { readonly code: "NoStrategyFound"; readonly message: string }
  | { readonly code: "NoAdjacentSubQuiz"; readonly message: string }
  | { readonly code: "NavigationNotAllowed"; readonly message: string }

/**
 * Context required to perform navigation decisions and operations.
 * Contains information about the current state, available sub-quizzes, and the target adjacent sub-quiz.
 */
export interface SubQuizNavigationContext {
  /** The currently active sub-quiz */
  currentSubQuiz: EnhancedSubQuiz
  /** List of all available sub-quizzes in the current session */
  subQuizzes: EnhancedSubQuiz[]
  /** The target sub-quiz for navigation (next or previous), if available */
  adjacentSubQuiz: EnhancedSubQuiz | undefined
  /** ID of the parent category */
  categoryId: string
}

/**
 * Interface defining a strategy for navigating between specific sub-quiz types.
 * Each strategy handles the transition logic between a source question type and a target question type.
 */
export interface ISubQuizNavigationStrategy {
  /**
   * Determines if navigation is allowed based on the current context.
   * Typically checks if the current sub-quiz is completed and if a target sub-quiz exists.
   *
   * @param context - The navigation context
   * @returns boolean - True if navigation is permitted
   */
  canNavigate(context: SubQuizNavigationContext): boolean

  /**
   * Executes the navigation process.
   * This usually involves performing any necessary side effects (like starting the next question)
   * and returning the target sub-quiz.
   *
   * @param context - The navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - An Effect resolving to the target sub-quiz
   */
  navigate(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>

  /**
   * Validates if a specific sub-quiz is considered completed.
   * Used internally by canNavigate to ensure progression requirements are met.
   *
   * @param subQuiz - The sub-quiz to check
   * @returns boolean - True if the sub-quiz is completed
   */
  validateCompletion(subQuiz: EnhancedSubQuiz): boolean
}

/**
 * Interface for a high-level navigation manager.
 * Responsible for orchestrating navigation decisions, often delegating to specific strategies.
 */
export interface ISubQuizNavigationManager {
  /**
   * Checks if forward navigation is possible.
   *
   * @param context - The navigation context
   * @returns boolean - True if forward navigation is allowed
   */
  canNavigateNext(context: SubQuizNavigationContext): boolean

  /**
   * Checks if backward navigation is possible.
   *
   * @param context - The navigation context
   * @returns boolean - True if backward navigation is allowed
   */
  canNavigatePrevious(context: SubQuizNavigationContext): boolean

  /**
   * Executes forward navigation.
   *
   * @param context - The navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - Effect resolving to the next sub-quiz
   */
  navigateNext(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>

  /**
   * Executes backward navigation.
   *
   * @param context - The navigation context
   * @returns Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> - Effect resolving to the previous sub-quiz
   */
  navigatePrevious(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>
}

/**
 * Union type representing all registered navigation strategy keys.
 * Format: "{SourceType}-to-{TargetType}"
 */
export type SubQuizNavigationStrategy =
  | "choiceQuestions-to-sequenceOrders"
  | "choiceQuestions-to-choiceQuestions"
  | "sequenceOrders-to-sequenceOrders"
  | "sequenceOrders-to-choiceQuestions"
