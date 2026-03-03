import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { StartQuizWire } from "@/modules/shared/shell/category_selection/services/start-quiz-fn"
import type { StartSkillWire } from "@/modules/shared/shell/category_selection/services/start-skill-fn"
import { Effect } from "effect"

/**
 * Defines the possible directions for content navigation.
 */
export type NavigationDirection = "next" | "previous"

export type NavigationStartSkippedReason =
  | "NoSelectedItem"
  | "NoNextItem"
  | "NextItemNotFound"
  | "AlreadyStartedOrCompleted"
  | "CannotStart"
  | "InvalidContentType"

export type NavigationStartWire =
  | StartSkillWire
  | StartQuizWire
  | { readonly _tag: "Skipped"; readonly reason: NavigationStartSkippedReason }

/**
 * Represents possible errors that can occur during navigation.
 * Uses discriminated unions for type-safe error handling.
 */
export type NavigationError =
  | { readonly _tag: "NoNextItem" }
  | { readonly _tag: "NoPreviousItem" }
  | { readonly _tag: "CompletionRequired" }
  | { readonly _tag: "ValidationFailed" }
  | { readonly _tag: "InvalidContentType" }
  | { readonly _tag: "FetchError" }
  | { readonly _tag: "RouterError" }

/**
 * Contextual information required for navigation operations.
 */
export type NavigationContext = {
  currentItem: CategoryContentItem
  direction: NavigationDirection
  categoryId: string
  adjacentItem?: CategoryContentItem
}

/**
 * Interface defining the contract for navigation managers.
 * Handles navigation logic between content items.
 */
export interface INavigationManager {
  /**
   * Navigates to the next content item.
   *
   * @param params - Object containing current and next items
   * @param params.currentItem - The item currently being viewed
   * @param params.nextItem - The target next item
   * @returns Effect resolving to the next item or failing with NavigationError
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Navigates to the previous content item.
   *
   * @param params - Object containing current and previous items
   * @param params.currentItem - The item currently being viewed
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to the previous item or failing with NavigationError
   */
  navigateToPrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError>

  /**
   * Checks if navigation to the next item is allowed.
   *
   * @param params - Object containing current and next items
   * @param params.currentItem - The item currently being viewed
   * @param params.nextItem - The target next item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>

  /**
   * Checks if navigation to the previous item is allowed.
   *
   * @param params - Object containing current and previous items
   * @param params.currentItem - The item currently being viewed
   * @param params.previousItem - The target previous item
   * @returns Effect resolving to boolean indicating if navigation is possible
   */
  canNavigatePrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError>
}
