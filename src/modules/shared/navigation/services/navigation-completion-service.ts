import { QuizCompletionService } from "./quiz-completion-service"
import { SkillCompletionService } from "./skill-completion-service"
import type { IQuizCompletionService } from "./quiz-completion-service"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import type { NavigationStartWire } from "../types/navigation-types"
import type { ISkillCompletionService } from "./skill-completion-service"
import type { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"
import type { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"

/**
 * Interface for service handling navigation completion logic for different content types.
 * Provides a unified API for checking status and starting items (skills, quizzes, etc.).
 */
export interface INavigationCompletionService {
  /**
   * Checks if a content item can be started based on prerequisites.
   *
   * @param item - The category content item to check
   * @returns True if the item can be started, false otherwise
   */
  canStartItem: (item: CategoryContentItem) => boolean

  /**
   * Checks if a content item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is completed, false otherwise
   */
  isItemCompleted: (item: CategoryContentItem) => boolean

  /**
   * Checks if a content item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the item is in progress, false otherwise
   */
  isItemStarted: (item: CategoryContentItem) => boolean

  /**
   * Validates if an item can be started and initiates the start process if valid.
   * Delegates to specific service based on content type.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  validateAndStartItem: (
    item: CategoryContentItem,
  ) => Promise<NavigationStartWire>
}

/**
 * Implementation of navigation completion service.
 * Acts as a facade/router delegating operations to specific completion services
 * (SkillCompletionService, QuizCompletionService) based on content type.
 */
export class NavigationCompletionService implements INavigationCompletionService {
  private quizCompletionService: IQuizCompletionService
  private skillCompletionService: ISkillCompletionService

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

  /**
   * Validates if an item can be started and initiates the start process if valid.
   * Delegates to specific service based on content type.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  async validateAndStartItem(
    item: CategoryContentItem,
  ): Promise<NavigationStartWire> {
    if (item.contentType === "skills")
      return this.skillCompletionService.validateAndStartItem(item)

    if (item.contentType === "quizzes")
      return this.quizCompletionService.validateAndStartItem(item)

    return { _tag: "Skipped", reason: "InvalidContentType" }
  }
}
