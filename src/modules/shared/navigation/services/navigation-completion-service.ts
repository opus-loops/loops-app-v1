import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"
import {
  QuizCompletionService,
  type IQuizCompletionService,
} from "./quiz-completion-service"
import {
  SkillCompletionService,
  type ISkillCompletionService,
} from "./skill-completion-service"

/**
 * Interface for service handling navigation completion logic for different content types.
 * Provides a unified API for checking status and starting items (skills, quizzes, etc.).
 */
export interface INavigationCompletionService {
  /**
   * Validates if an item can be started and initiates the start process if valid.
   * Delegates to specific service based on content type.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to true if item was successfully started, false otherwise
   */
  validateAndStartItem(item: CategoryContentItem): Promise<boolean>

  /**
   * Checks if a content item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean

  /**
   * Checks if a content item can be started based on prerequisites.
   *
   * @param item - The category content item to check
   * @returns True if the item can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean

  /**
   * Checks if a content item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean
}

/**
 * Implementation of navigation completion service.
 * Acts as a facade/router delegating operations to specific completion services
 * (SkillCompletionService, QuizCompletionService) based on content type.
 */
export class NavigationCompletionService implements INavigationCompletionService {
  private skillCompletionService: ISkillCompletionService
  private quizCompletionService: IQuizCompletionService

  /**
   * Creates an instance of NavigationCompletionService.
   * Initializes specific completion services with required hooks.
   *
   * @param startSkillHook - Hook result for starting skills
   * @param startQuizHook - Hook result for starting quizzes
   */
  constructor(
    startSkillHook: ReturnType<typeof useStartSkill>,
    startQuizHook: ReturnType<typeof useStartQuiz>,
  ) {
    this.skillCompletionService = new SkillCompletionService(startSkillHook)
    this.quizCompletionService = new QuizCompletionService(startQuizHook)
  }

  /**
   * Validates if an item can be started and initiates the start process if valid.
   * Delegates to specific service based on content type.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to true if item was successfully started, false otherwise
   */
  async validateAndStartItem(item: CategoryContentItem): Promise<boolean> {
    if (item.contentType === "skills")
      return this.skillCompletionService.validateAndStartItem(item)

    if (item.contentType === "quizzes")
      return this.quizCompletionService.validateAndStartItem(item)

    return false
  }

  /**
   * Checks if a content item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean {
    if (item.contentType === "skills")
      return this.skillCompletionService.isItemCompleted(item)

    if (item.contentType === "quizzes")
      return this.quizCompletionService.isItemCompleted(item)

    return false
  }

  /**
   * Checks if a content item can be started based on prerequisites.
   *
   * @param item - The category content item to check
   * @returns True if the item can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean {
    if (item.contentType === "skills")
      return this.skillCompletionService.canStartItem(item)

    if (item.contentType === "quizzes")
      return this.quizCompletionService.canStartItem(item)

    return false
  }

  /**
   * Checks if a content item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean {
    if (item.contentType === "skills")
      return this.skillCompletionService.isItemStarted(item)

    if (item.contentType === "quizzes")
      return this.quizCompletionService.isItemStarted(item)

    return false
  }
}
