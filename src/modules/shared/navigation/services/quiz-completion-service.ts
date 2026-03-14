import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"

import type { NavigationStartWire } from "../types/navigation-types"

/**
 * Interface for service handling quiz completion logic.
 * Manages validation, starting, and status checking for quiz items.
 */
export interface IQuizCompletionService {
  /**
   * Checks if a quiz item can be started.
   *
   * @param item - The category content item to check
   * @returns True if the quiz can be started, false otherwise
   */
  canStartItem: (item: CategoryContentItem) => boolean

  /**
   * Checks if a quiz item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is completed, false otherwise
   */
  isItemCompleted: (item: CategoryContentItem) => boolean

  /**
   * Checks if a quiz item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is in progress, false otherwise
   */
  isItemStarted: (item: CategoryContentItem) => boolean

  /**
   * Validates if a quiz item can be started and initiates the start process if valid.
   *
   * @param item - The category content item to start (must be a quiz)
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  validateAndStartItem: (
    item: CategoryContentItem,
  ) => Promise<NavigationStartWire>
}

/**
 * Implementation of quiz completion service.
 * Handles the logic for starting quizzes and checking their status.
 */
export class QuizCompletionService implements IQuizCompletionService {
  /**
   * Creates an instance of QuizCompletionService.
   *
   * @param startQuizHook - Hook result containing the handleStartQuiz function
   */
  constructor(private startQuizHook: ReturnType<typeof useStartQuiz>) {}

  /**
   * Checks if a quiz item can be started.
   * Currently allows starting if the item is not already completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean {
    if (item.contentType !== "quizzes") return false
    return !this.isItemCompleted(item)
  }

  /**
   * Checks if a quiz item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean {
    if (item.contentType !== "quizzes") return false
    return item.itemProgress?.status === "completed"
  }

  /**
   * Checks if a quiz item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean {
    if (item.contentType !== "quizzes") return false
    return !!item.itemProgress && !this.isItemCompleted(item)
  }

  /**
   * Validates if a quiz item can be started and initiates the start process if valid.
   * Checks if the item is a quiz, if it's already started/completed, or if it can be started.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  async validateAndStartItem(
    item: CategoryContentItem,
  ): Promise<NavigationStartWire> {
    if (item.contentType !== "quizzes")
      return { _tag: "Skipped", reason: "InvalidContentType" }
    if (this.isItemCompleted(item) || this.isItemStarted(item))
      return { _tag: "Skipped", reason: "AlreadyStartedOrCompleted" }
    if (!this.canStartItem(item))
      return { _tag: "Skipped", reason: "CannotStart" }

    const response = await this.startQuizHook.handleStartQuiz(
      item.categoryId,
      item.itemId,
    )

    return response
  }
}
