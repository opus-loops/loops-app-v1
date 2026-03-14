import { Effect } from "effect"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import type {
  INavigationManager,
  NavigationError,
} from "../types/navigation-types"
import type { IQuizNavigationManager } from "./quiz-navigation-manager"
import type { ISkillNavigationManager } from "./skill-navigation-manager"

import { QuizNavigationManager } from "./quiz-navigation-manager"
import { SkillNavigationManager } from "./skill-navigation-manager"

/**
 * Main navigation manager that delegates to content-specific managers.
 * Acts as a facade/router for navigation operations based on content type.
 */
export class NavigationManager implements INavigationManager {
  private quizNavigationManager: IQuizNavigationManager
  private skillNavigationManager: ISkillNavigationManager

  /**
   * Creates an instance of NavigationManager.
   * Initializes specific managers for skills and quizzes.
   */
  constructor() {
    this.skillNavigationManager = new SkillNavigationManager()
    this.quizNavigationManager = new QuizNavigationManager()
  }

  /**
   * Checks if navigation to the next item is allowed.
   * Delegates to the appropriate manager based on current item's content type.
   */
  canNavigateNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError> {
    if (params.currentItem.contentType === "skills")
      return this.skillNavigationManager.canNavigateNext(params)

    if (params.currentItem.contentType === "quizzes")
      return this.quizNavigationManager.canNavigateNext(params)

    return Effect.succeed(false)
  }

  /**
   * Checks if navigation to the previous item is allowed.
   * Delegates to the appropriate manager based on current item's content type.
   */
  canNavigatePrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<boolean, NavigationError> {
    if (params.currentItem.contentType === "skills")
      return this.skillNavigationManager.canNavigatePrevious(params)

    if (params.currentItem.contentType === "quizzes")
      return this.quizNavigationManager.canNavigatePrevious(params)

    return Effect.succeed(false)
  }

  /**
   * Navigates to the next content item.
   * Delegates to the appropriate manager based on current item's content type.
   */
  navigateToNext(params: {
    currentItem: CategoryContentItem
    nextItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError> {
    if (params.currentItem.contentType === "skills")
      return this.skillNavigationManager.navigateToNext(params)

    if (params.currentItem.contentType === "quizzes")
      return this.quizNavigationManager.navigateToNext(params)

    return Effect.fail({
      _tag: "InvalidContentType" as const,
    })
  }

  /**
   * Navigates to the previous content item.
   * Delegates to the appropriate manager based on current item's content type.
   */
  navigateToPrevious(params: {
    currentItem: CategoryContentItem
    previousItem: CategoryContentItem
  }): Effect.Effect<CategoryContentItem, NavigationError> {
    if (params.currentItem.contentType === "skills")
      return this.skillNavigationManager.navigateToPrevious(params)

    if (params.currentItem.contentType === "quizzes")
      return this.quizNavigationManager.navigateToPrevious(params)

    return Effect.fail({
      _tag: "InvalidContentType" as const,
    })
  }
}
