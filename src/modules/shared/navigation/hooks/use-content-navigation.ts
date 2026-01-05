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

  // Fetch category items if selectedItem is available
  const { categoryItems } = useCategoryContent({ categoryId })

  const startSkillHook = useStartSkill()
  const startQuizHook = useStartQuiz()

  // Initialize services
  const navigationManager = useMemo(() => new NavigationManager(), [])

  const completionService = useMemo(
    () => new NavigationCompletionService(startSkillHook, startQuizHook),
    [startSkillHook, startQuizHook],
  )

  const checkIfNextItemIsAvailable = useCallback(
    (currentItem: CategoryContentItem): boolean => {
      // Check if next item exists
      const nextItemId = currentItem.nextCategoryItem
      if (!nextItemId) return false

      // Find the next item in the categoryItems array
      const nextItem = categoryItems.find(
        (item) => item.categoryItemId === nextItemId,
      )

      if (!nextItem) return false

      // Check if next item is started or completed
      const isNextItemStartedOrCompleted =
        nextItem.contentType === "skills"
          ? nextItem.completedSkill !== undefined
          : nextItem.contentType === "quizzes"
            ? nextItem.startedQuiz !== undefined
            : false

      return isNextItemStartedOrCompleted
    },
    [categoryItems],
  )

  const shouldUseSimpleNavigation = useCallback(
    (currentItem: CategoryContentItem | null): boolean => {
      if (!currentItem) return false

      const isCurrentItemValidated =
        currentItem.contentType === "quizzes"
          ? currentItem.startedQuiz?.status === "completed"
          : currentItem.contentType === "skills"
            ? currentItem.completedSkill?.isCompleted === true
            : false

      if (!isCurrentItemValidated) return false

      return checkIfNextItemIsAvailable(currentItem)
    },
    [checkIfNextItemIsAvailable],
  )

  const performSimpleNavigation = useCallback(
    async (
      currentItem: CategoryContentItem,
      direction: "next" | "previous",
    ) => {
      const targetItemId =
        direction === "next"
          ? currentItem.nextCategoryItem
          : currentItem.previousCategoryItem

      // Find the target item in the categoryItems array
      const targetItem = categoryItems.find(
        (item) => item.categoryItemId === targetItemId,
      )

      if (!targetItem)
        return Effect.fail({
          code: "navigation_error" as const,
          message: "Target item not found in category items",
        })

      const navigationEffect = Effect.gen(function* () {
        // Update context with the new item
        setNavigationState({
          isNavigating: true,
          navigationDirection: direction,
          previousItem: currentItem,
        })

        // Navigate using router
        yield* Effect.tryPromise({
          try: () =>
            router.navigate({
              to: "/",
              search: {
                category: currentItem.categoryId,
                contentId: targetItem.itemId,
                type: "content",
              },
            }),
          catch: () => ({
            code: "router_error" as const,
            message: "Failed to navigate with router",
          }),
        })

        // Update selected content with direction
        navigateToItem({ item: targetItem, direction })

        // Reset navigation state
        resetNavigationState()

        return {
          targetItem,
          direction,
        }
      })

      await Effect.runPromise(
        Effect.match(navigationEffect, {
          onFailure: (failure) => {
            resetNavigationState()
            error(failure.message)
          },
          onSuccess: () => {},
        }),
      )
    },
    [
      categoryItems,
      router,
      navigateToItem,
      setNavigationState,
      resetNavigationState,
      success,
      error,
    ],
  )

  const handleNavigationResult = useCallback(
    async (
      navigationEffect: Effect.Effect<CategoryContentItem, NavigationError>,
      direction: "next" | "previous",
    ) => {
      await Effect.runPromise(
        Effect.match(navigationEffect, {
          onFailure: (navigationError) => {
            // Handle navigation failure based on error type
            const errorMessages: Record<NavigationError["_tag"], string> = {
              NoNextItem: "No next item available",
              NoPreviousItem: "No previous item available",
              CompletionRequired:
                "Please complete the current item before proceeding",
              ValidationFailed: "Navigation failed due to validation error",
              InvalidContentType: "Invalid content type for navigation",
              FetchError: "Failed to fetch navigation target",
              RouterError: "Navigation routing error occurred",
              NoStrategyFound: "No suitable navigation strategy found",
            }

            error(
              errorMessages[navigationError._tag] ||
                navigationError.message ||
                "Navigation failed",
            )
          },
          onSuccess: async (targetItem) => {
            // Update router to reflect new content
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

            // Update context with navigation
            navigateToItem({ item: targetItem, direction })

            // Invalidate queries to refresh data
            await queryClient.invalidateQueries({
              queryKey: [
                "single-category-item",
                targetItem.categoryId,
                targetItem.itemId,
              ],
            })

            success(`Navigated to ${direction} ${targetItem.contentType}`)
          },
        }),
      )
    },
    [router, navigateToItem, queryClient, success, error],
  )

  const navigateToNext = useCallback(async () => {
    if (!selectedItem) return error("No item selected")

    // Check if we can use simple navigation
    const canUseSimpleNavigation = shouldUseSimpleNavigation(selectedItem)

    if (canUseSimpleNavigation) {
      await performSimpleNavigation(selectedItem, "next")
      return
    }

    await handleNavigationResult(
      navigationManager.navigateToNext({
        currentItem: selectedItem,
        categoryItems,
      }),
      "next",
    )
  }, [
    selectedItem,
    categoryItems,
    navigationManager,
    handleNavigationResult,
    error,
    shouldUseSimpleNavigation,
    performSimpleNavigation,
  ])

  const navigateToPrevious = useCallback(async () => {
    if (!selectedItem) return error("No item selected")

    // Previous navigation is always simple navigation since previous items are completed by intuition
    await performSimpleNavigation(selectedItem, "previous")
  }, [selectedItem, performSimpleNavigation, error])

  const canNavigateNext = useCallback(async (): Promise<boolean> => {
    if (!selectedItem) return false

    return await Effect.runPromise(
      Effect.match(
        navigationManager.canNavigateNext({
          currentItem: selectedItem,
          categoryItems,
        }),
        {
          onFailure: () => false,
          onSuccess: (canNavigate) => canNavigate,
        },
      ),
    )
  }, [selectedItem, categoryItems, navigationManager])

  const canNavigatePrevious = useCallback(async (): Promise<boolean> => {
    if (!selectedItem) return false

    return await Effect.runPromise(
      Effect.match(
        navigationManager.canNavigatePrevious({
          currentItem: selectedItem,
          categoryItems,
        }),
        {
          onFailure: () => false,
          onSuccess: (canNavigate) => canNavigate,
        },
      ),
    )
  }, [selectedItem, categoryItems, navigationManager])

  const handleBackNavigation = useCallback(async () => {
    // Reset navigation state when going back
    resetNavigationState()

    if (!canGoBack) {
      // Clear selected content and navigate to home
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

    // Use browser history
    router.history.back()
  }, [canGoBack, router, clearSelectedContent, resetNavigationState])

  const exitContent = useCallback(async () => {
    // Clear all navigation state and selected content
    clearSelectedContent()
    resetNavigationState()

    // Navigate back to category view
    if (selectedItem) {
      const routerEffect = Effect.tryPromise({
        try: () =>
          router.navigate({
            to: "/",
            search: (prev: any) => ({
              ...prev,
              category: selectedItem.categoryId,
              type: undefined,
              contentId: undefined,
            }),
          }),
        catch: () => ({
          code: "router_error" as const,
          message: "Failed to navigate with router",
        }),
      })

      await Effect.runPromise(routerEffect)
      return
    }

    const routerEffect = Effect.tryPromise({
      try: () => router.navigate({ to: "/" }),
      catch: () => ({
        code: "router_error" as const,
        message: "Failed to navigate with router",
      }),
    })

    await Effect.runPromise(routerEffect)
  }, [selectedItem, router, clearSelectedContent, resetNavigationState])

  const validateAndStartItem = useCallback(async (): Promise<boolean> => {
    if (!selectedItem) return false

    // Get the next item ID from the current item
    const nextItemId = selectedItem.nextCategoryItem
    if (!nextItemId) return false

    // Find the next item in the categoryItems array
    const nextItem = categoryItems.find(
      (item) => item.categoryItemId === nextItemId,
    )

    if (!nextItem) return false

    // Validate and start the next item
    return await completionService.validateAndStartItem(nextItem)
  }, [completionService, selectedItem, categoryItems])

  const isItemCompleted = useCallback(
    (item: CategoryContentItem): boolean =>
      completionService.isItemCompleted(item),
    [completionService],
  )

  return {
    // Navigation actions
    navigateToNext,
    navigateToPrevious,
    handleBackNavigation,
    exitContent,

    // Navigation state checks
    canNavigateNext,
    canNavigatePrevious,

    // Current state
    selectedItem,
    navigationState,

    // Completion utilities
    validateAndStartItem,
    isItemCompleted,

    // Router utilities
    canGoBack,
  }
}
