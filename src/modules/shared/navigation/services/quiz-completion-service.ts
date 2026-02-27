import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"

/**
 * Interface for service handling quiz completion logic.
 * Manages validation, starting, and status checking for quiz items.
 */
export interface IQuizCompletionService {
  /**
   * Validates if a quiz item can be started and initiates the start process if valid.
   *
   * @param item - The category content item to start (must be a quiz)
   * @returns Promise resolving to true if quiz was successfully started or already active, false otherwise
   */
  validateAndStartItem(item: CategoryContentItem): Promise<boolean>

  /**
   * Checks if a quiz item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean

  /**
   * Checks if a quiz item can be started.
   *
   * @param item - The category content item to check
   * @returns True if the quiz can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean

  /**
   * Checks if a quiz item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean
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
   * Validates if a quiz item can be started and initiates the start process if valid.
   * Checks if the item is a quiz, if it's already started/completed, or if it can be started.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to true if quiz was successfully started or already active, false otherwise
   */
  async validateAndStartItem(item: CategoryContentItem): Promise<boolean> {
    if (item.contentType !== "quizzes") return false
    if (this.isItemCompleted(item) || this.isItemStarted(item)) return true
    if (!this.canStartItem(item)) return false

    const response = await this.startQuizHook.handleStartQuiz(
      item.categoryId,
      item.itemId,
    )

    return response._tag === "Success"
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
   * Checks if a quiz item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the quiz is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean {
    if (item.contentType !== "quizzes") return false
    return !!item.itemProgress && !this.isItemCompleted(item)
  }
}
