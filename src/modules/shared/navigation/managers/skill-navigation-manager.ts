import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { Effect } from "effect"
import type { NavigationError } from "../types/navigation-types"

/**
 * Interface for the skill navigation manager.
 * Handles navigation logic specifically for skill content items.
 */
export interface ISkillNavigationManager {
  /**
   * Navigates to the next content item from a skill.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current skill item
   * @param params.nextItem - The target next item
   * @returns Effect resolving to the next item or failing with NavigationError
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Navigates to the previous content item from a skill.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current skill item
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to the previous item or failing with NavigationError
   */
  navigateToPrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Checks if navigation to the next item is allowed from a skill.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current skill item
   * @param params.nextItem - The target next item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>

  /**
   * Checks if navigation to the previous item is allowed from a skill.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current skill item
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigatePrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>
}

/**
 * Implementation of the skill navigation manager.
 * Enforces completion requirements for skills before allowing forward navigation.
 */
export class SkillNavigationManager implements ISkillNavigationManager {
  /**
   * Navigates to the next content item.
   * Requires the current skill to be completed.
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError> {
    const { currentItem, nextItem } = params

    return Effect.gen(function* () {
      if (currentItem.contentType !== "skills") {
        return yield* Effect.fail({
          _tag: "InvalidContentType" as const,
          message: "Current item must be a skill",
        })
      }

      if (!currentItem.itemProgress?.isCompleted) {
        return yield* Effect.fail({
          _tag: "CompletionRequired" as const,
          message: "Current skill must be completed to navigate",
        })
      }

      if (!nextItem) {
        return yield* Effect.fail({
          _tag: "FetchError" as const,
          message: "Adjacent item not provided",
        })
      }

      return nextItem
    })
  }

  /**
   * Navigates to the previous content item.
   * Allows navigation without completion requirements.
   */
  navigateToPrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError> {
    const { currentItem, previousItem } = params

    return Effect.gen(function* () {
      if (currentItem.contentType !== "skills") {
        return yield* Effect.fail({
          _tag: "InvalidContentType" as const,
          message: "Current item must be a skill",
        })
      }

      if (!previousItem) {
        return yield* Effect.fail({
          _tag: "FetchError" as const,
          message: "Adjacent item not provided",
        })
      }

      return previousItem
    })
  }

  /**
   * Checks if navigation to the next item is possible.
   * Returns true only if the current skill is completed and the next item exists.
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError> {
    const { currentItem, nextItem } = params

    if (currentItem.contentType !== "skills") return Effect.succeed(false)
    const isCompleted = currentItem.itemProgress?.isCompleted === true

    const hasNextItem = !!nextItem

    return Effect.succeed(isCompleted && hasNextItem)
  }

  /**
   * Checks if navigation to the previous item is possible.
   * Always allows navigation if the previous item exists.
   */
  canNavigatePrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError> {
    const { previousItem } = params

    return Effect.succeed(!!previousItem)
  }
}
