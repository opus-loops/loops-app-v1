import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { Effect } from "effect"

/**
 * Defines the possible directions for content navigation.
 */
export type NavigationDirection = "next" | "previous"

/**
 * Represents possible errors that can occur during navigation.
 * Uses discriminated unions for type-safe error handling.
 */
export type NavigationError =
  | { readonly _tag: "NoNextItem"; readonly message: string }
  | { readonly _tag: "NoPreviousItem"; readonly message: string }
  | { readonly _tag: "CompletionRequired"; readonly message: string }
  | { readonly _tag: "ValidationFailed"; readonly message: string }
  | { readonly _tag: "InvalidContentType"; readonly message: string }
  | { readonly _tag: "FetchError"; readonly message: string }
  | { readonly _tag: "RouterError"; readonly message: string }

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
