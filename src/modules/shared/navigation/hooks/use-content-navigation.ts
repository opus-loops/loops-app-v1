import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"
import { useQueryClient } from "@tanstack/react-query"
import { useCanGoBack, useRouter } from "@tanstack/react-router"
import { Effect } from "effect"
import { useCallback, useMemo } from "react"
import { NavigationManager } from "../managers/navigation-manager"
import { NavigationCompletionService } from "../services/navigation-completion-service"
import type { NavigationError } from "../types/navigation-types"

type UseContentNavigationProps = { categoryId: string }

/**
 * Hook for handling content navigation logic.
 * Manages navigation between skills, quizzes, and other content items.
 * Handles validation, completion checks, and router navigation.
 *
 * @param props - Hook properties
 * @param props.categoryId - The ID of the category being navigated
 * @returns Navigation methods and state
 */
export function useContentNavigation({
  categoryId,
}: UseContentNavigationProps) {
  const router = useRouter()
  const canGoBack = useCanGoBack()
  const queryClient = useQueryClient()
  const { success, error } = useToast()

  const {
    selectedItem,
    navigationState,
    navigateToItem,
    clearSelectedContent,
    setNavigationState,
    resetNavigationState,
  } = useSelectedContent()

  const { categoryItems } = useCategoryContent({ categoryId })

  const startSkillHook = useStartSkill()
  const startQuizHook = useStartQuiz()

  const navigationManager = useMemo(() => new NavigationManager(), [])

  const completionService = useMemo(
    () => new NavigationCompletionService(startSkillHook, startQuizHook),
    [startSkillHook, startQuizHook],
  )

  /**
   * Handles the result of a navigation effect.
   * Executes the navigation side effects (router, context update, query invalidation) on success,
   * or shows an error toast on failure.
   */
  const handleNavigationResult = useCallback(
    async (
      navigationEffect: Effect.Effect<CategoryContentItem, NavigationError>,
      direction: "next" | "previous",
    ) => {
      await Effect.runPromise(
        Effect.match(navigationEffect, {
          onFailure: (navigationError) => {
            const errorMessages: Record<NavigationError["_tag"], string> = {
              NoNextItem: "No next item available",
              NoPreviousItem: "No previous item available",
              CompletionRequired:
                "Please complete the current item before proceeding",
              ValidationFailed: "Navigation failed due to validation error",
              InvalidContentType: "Invalid content type for navigation",
              FetchError: "Failed to fetch navigation target",
              RouterError: "Navigation routing error occurred",
            }

            error(
              errorMessages[navigationError._tag] ||
                navigationError.message ||
                "Navigation failed",
            )
          },
          onSuccess: async (targetItem) => {
            const routerEffect = Effect.tryPromise({
              try: () =>
                router.navigate({
                  to: "/",
                  search: (prev: any) => ({
                    ...prev,
                    type: "content",
                    contentId: targetItem.itemId,
                    category: targetItem.categoryId,
                  }),
                }),
              catch: () => ({
                code: "router_error" as const,
                message: "Failed to navigate with router",
              }),
            })

            await Effect.runPromise(routerEffect)

            navigateToItem({ item: targetItem, direction })
          },
        }),
      )
    },
    [router, navigateToItem, queryClient, success, error],
  )

  /**
   * Navigates to the next content item.
   * Validates if navigation is allowed (e.g. current item completed) before navigating.
   */
  const navigateToNext = useCallback(async () => {
    if (!selectedItem) return error("No item selected")

    const nextItemId = selectedItem.nextCategoryItem
    if (!nextItemId) return error("No next item")

    const nextItem = categoryItems.find(
      (item) => item.categoryItemId === nextItemId,
    )

    if (!nextItem) return false

    await handleNavigationResult(
      navigationManager.navigateToNext({
        currentItem: selectedItem,
        nextItem,
      }),
      "next",
    )
  }, [
    selectedItem,
    categoryItems,
    navigationManager,
    handleNavigationResult,
    error,
  ])

  /**
   * Navigates to the previous content item.
   * Usually allows navigation without completion checks on the current item.
   */
  const navigateToPrevious = useCallback(async () => {
    if (!selectedItem) return error("No item selected")

    const previousItemId = selectedItem.previousCategoryItem
    if (!previousItemId) return error("No previous item")

    const previousItem = categoryItems.find(
      (item) => item.categoryItemId === previousItemId,
    )

    if (!previousItem) return error("No previous item")

    await handleNavigationResult(
      navigationManager.navigateToPrevious({
        currentItem: selectedItem,
        previousItem,
      }),
      "previous",
    )
  }, [
    selectedItem,
    categoryItems,
    navigationManager,
    handleNavigationResult,
    error,
  ])

  /**
   * Checks if navigation to the next item is possible.
   * Returns a boolean indicating if the next button should be enabled.
   */
  const canNavigateNext = useMemo((): boolean => {
    if (!selectedItem) return false

    const nextItemId = selectedItem.nextCategoryItem
    if (!nextItemId) return false

    const nextItem = categoryItems.find(
      (item) => item.categoryItemId === nextItemId,
    )

    if (!nextItem) return false

    return Effect.runSync(
      Effect.match(
        navigationManager.canNavigateNext({
          currentItem: selectedItem,
          nextItem,
        }),
        {
          onFailure: () => false,
          onSuccess: (canNavigate) => canNavigate,
        },
      ),
    )
  }, [selectedItem, categoryItems, navigationManager])

  /**
   * Checks if navigation to the previous item is possible.
   * Returns a boolean indicating if the previous button should be enabled.
   */
  const canNavigatePrevious = useMemo((): boolean => {
    if (!selectedItem) return false

    const previousItemId = selectedItem.previousCategoryItem
    if (!previousItemId) return false

    const previousItem = categoryItems.find(
      (item) => item.categoryItemId === previousItemId,
    )

    if (!previousItem) return false

    return Effect.runSync(
      Effect.match(
        navigationManager.canNavigatePrevious({
          currentItem: selectedItem,
          previousItem,
        }),
        {
          onFailure: () => false,
          onSuccess: (canNavigate) => canNavigate,
        },
      ),
    )
  }, [selectedItem, categoryItems, navigationManager])

  /**
   * Handles back navigation (e.g. back button in header).
   * Uses router history or clears selection if no history.
   */
  const handleBackNavigation = useCallback(async () => {
    resetNavigationState()

    if (!canGoBack) {
      clearSelectedContent()

      const routerEffect = Effect.tryPromise({
        try: () => router.navigate({ to: "/" }),
        catch: () => ({
          code: "router_error" as const,
          message: "Failed to navigate with router",
        }),
      })

      await Effect.runPromise(routerEffect)
      return
    }

    router.history.back()
  }, [canGoBack, router, clearSelectedContent, resetNavigationState])

  /**
   * Exits the content view and returns to the category list.
   * Clears all navigation state.
   */
  const exitContent = useCallback(async () => {
    clearSelectedContent()
    resetNavigationState()

    const routerEffect = Effect.tryPromise({
      try: () => router.navigate({ to: "/" }),
      catch: () => ({
        code: "router_error" as const,
        message: "Failed to navigate with router",
      }),
    })

    await Effect.runPromise(routerEffect)
  }, [router, clearSelectedContent, resetNavigationState])

  /**
   * Validates prerequisites for the next item and starts it.
   * Used for "Continue" actions where the next item needs to be initialized.
   */
  const validateAndStartItem = useCallback(async (): Promise<boolean> => {
    if (!selectedItem) return false

    const nextItemId = selectedItem.nextCategoryItem
    if (!nextItemId) return false

    const nextItem = categoryItems.find(
      (item) => item.categoryItemId === nextItemId,
    )

    if (!nextItem) return false

    return await completionService.validateAndStartItem(nextItem)
  }, [completionService, selectedItem, categoryItems])

  /**
   * Checks if the next item is completed.
   * Returns a boolean indicating if the next item is completed.
   */
  const isNextItemCompleted = useMemo(() => {
    if (!selectedItem) return false

    const nextItemId = selectedItem.nextCategoryItem
    if (!nextItemId) return false

    const nextItem = categoryItems.find(
      (item) => item.categoryItemId === nextItemId,
    )

    if (!nextItem) return false

    return completionService.isItemCompleted(nextItem)
  }, [completionService, selectedItem, categoryItems])

  return {
    navigateToNext,
    navigateToPrevious,
    handleBackNavigation,
    exitContent,
    canNavigateNext,
    canNavigatePrevious,
    selectedItem,
    navigationState,
    isNextItemCompleted,
    validateAndStartItem,
    canGoBack,
  }
}
