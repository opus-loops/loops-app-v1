import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"
import type { NavigationStartWire } from "../types/navigation-types"

/**
 * Interface for service handling skill completion logic.
 * Manages validation, starting, and status checking for skill items.
 */
export interface ISkillCompletionService {
  /**
   * Validates if a skill item can be started and initiates the start process if valid.
   *
   * @param item - The category content item to start (must be a skill)
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  validateAndStartItem(item: CategoryContentItem): Promise<NavigationStartWire>

  /**
   * Checks if a skill item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the skill is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean

  /**
   * Checks if a skill item can be started.
   *
   * @param item - The category content item to check
   * @returns True if the skill can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean

  /**
   * Checks if a skill item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the skill is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean
}

/**
 * Implementation of skill completion service.
 * Handles the logic for starting skills and checking their status.
 */
export class SkillCompletionService implements ISkillCompletionService {
  /**
   * Creates an instance of SkillCompletionService.
   *
   * @param startSkillHook - Hook result containing the handleStartSkill function
   */
  constructor(private startSkillHook: ReturnType<typeof useStartSkill>) {}

  /**
   * Validates if a skill item can be started and initiates the start process if valid.
   * Checks if the item is a skill, if it's already started/completed, or if it can be started.
   *
   * @param item - The category content item to start
   * @returns Promise resolving to a start response (or a skipped reason)
   */
  async validateAndStartItem(item: CategoryContentItem): Promise<NavigationStartWire> {
    if (item.contentType !== "skills")
      return { _tag: "Skipped", reason: "InvalidContentType" }
    if (this.isItemCompleted(item) || this.isItemStarted(item))
      return { _tag: "Skipped", reason: "AlreadyStartedOrCompleted" }
    if (!this.canStartItem(item)) return { _tag: "Skipped", reason: "CannotStart" }

    const response = await this.startSkillHook.handleStartSkill({
      categoryId: item.categoryId,
      skillId: item.itemId,
    })

    return response
  }

  /**
   * Checks if a skill item has been completed.
   *
   * @param item - The category content item to check
   * @returns True if the skill is completed, false otherwise
   */
  isItemCompleted(item: CategoryContentItem): boolean {
    if (item.contentType !== "skills") return false
    return item.itemProgress?.isCompleted === true
  }

  /**
   * Checks if a skill item can be started.
   * Currently allows starting if the item is not already completed.
   *
   * @param item - The category content item to check
   * @returns True if the skill can be started, false otherwise
   */
  canStartItem(item: CategoryContentItem): boolean {
    if (item.contentType !== "skills") return false
    return !this.isItemCompleted(item)
  }

  /**
   * Checks if a skill item has been started but not yet completed.
   *
   * @param item - The category content item to check
   * @returns True if the skill is in progress, false otherwise
   */
  isItemStarted(item: CategoryContentItem): boolean {
    if (item.contentType !== "skills") return false
    return !!item.itemProgress && !this.isItemCompleted(item)
  }
}
