import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { Effect } from "effect"
import type { NavigationError } from "../types/navigation-types"

/**
 * Interface for the quiz navigation manager.
 * Handles navigation logic specifically for quiz content items.
 */
export interface IQuizNavigationManager {
  /**
   * Navigates to the next content item from a quiz.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current quiz item
   * @param params.nextItem - The target next item
   * @returns Effect resolving to the next item or failing with NavigationError
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Navigates to the previous content item from a quiz.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current quiz item
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to the previous item or failing with NavigationError
   */
  navigateToPrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Checks if navigation to the next item is allowed from a quiz.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current quiz item
   * @param params.nextItem - The target next item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>

  /**
   * Checks if navigation to the previous item is allowed from a quiz.
   *
   * @param params - Navigation parameters
   * @param params.currentItem - The current quiz item
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigatePrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>
}

/**
 * Implementation of the quiz navigation manager.
 * Enforces completion requirements for quizzes before allowing forward navigation.
 */
export class QuizNavigationManager implements IQuizNavigationManager {
  /**
   * Navigates to the next content item.
   * Requires the current quiz to be completed.
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError> {
    const { currentItem, nextItem } = params

    return Effect.gen(function* () {
      if (currentItem.contentType !== "quizzes") {
        return yield* Effect.fail({
          _tag: "InvalidContentType" as const,
          message: "Current item must be a quiz",
        })
      }

      if (currentItem.itemProgress?.status !== "completed") {
        return yield* Effect.fail({
          _tag: "CompletionRequired" as const,
          message: "Current quiz must be completed to navigate",
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
      if (currentItem.contentType !== "quizzes") {
        return yield* Effect.fail({
          _tag: "InvalidContentType" as const,
          message: "Current item must be a quiz",
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
   * Returns true only if the current quiz is completed and the next item exists.
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError> {
    const { currentItem, nextItem } = params

    if (currentItem.contentType !== "quizzes") return Effect.succeed(false)

    const isCompleted = currentItem.itemProgress?.status === "completed"

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
