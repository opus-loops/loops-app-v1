import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"

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

export interface SubQuizNavigationContext {
  currentSubQuiz: EnhancedSubQuiz
  subQuizzes: EnhancedSubQuiz[]
  adjacentSubQuiz: EnhancedSubQuiz | undefined
  categoryId: string
}

export interface ISubQuizNavigationStrategy {
  canNavigate(context: SubQuizNavigationContext): boolean
  navigate(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>
  validateCompletion(subQuiz: EnhancedSubQuiz): boolean
}

export interface ISubQuizNavigationManager {
  canNavigateNext(context: SubQuizNavigationContext): boolean
  canNavigatePrevious(context: SubQuizNavigationContext): boolean
  navigateNext(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>
  navigatePrevious(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>
}

export type SubQuizNavigationStrategy =
  | "choice_question-to-sequence_order"
  | "choice_question-to-choice_question"
  | "sequence_order-to-sequence_order"
  | "sequence_order-to-choice_question"
