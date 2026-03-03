import { useQueryClient } from "@tanstack/react-query"
import { useCanGoBack, useRouter } from "@tanstack/react-router"
import { Effect } from "effect"
import { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

import { NavigationManager } from "../managers/navigation-manager"
import { NavigationCompletionService } from "../services/navigation-completion-service"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import type {
  NavigationError,
  NavigationStartWire,
} from "../types/navigation-types"
import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"

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
  const { error, success } = useToast()
  const { t } = useTranslation()

  const {
    clearSelectedContent,
    navigateToItem,
    navigationState,
    resetNavigationState,
    selectedItem,
    setNavigationState,
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
              CompletionRequired: t("navigation.errors.completion_required"),
              FetchError: t("navigation.errors.fetch_error"),
              InvalidContentType: t("navigation.errors.invalid_content_type"),
              NoNextItem: t("navigation.errors.no_next_item"),
              NoPreviousItem: t("navigation.errors.no_previous_item"),
              RouterError: t("navigation.errors.router_error"),
              ValidationFailed: t("navigation.errors.validation_failed"),
            }

            error(
              errorMessages[navigationError._tag] ||
                t("navigation.errors.generic_failed"),
            )
          },
          onSuccess: async (targetItem) => {
            const routerEffect = Effect.tryPromise({
              catch: () => ({
                code: "router_error" as const,
                message: "Failed to navigate with router",
              }),
              try: () =>
                router.navigate({
                  search: (prev: any) => ({
                    ...prev,
                    category: targetItem.categoryId,
                    contentId: targetItem.itemId,
                    type: "content",
                  }),
                  to: "/",
                }),
            })

            await Effect.runPromise(routerEffect)

            navigateToItem({ direction, item: targetItem })
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
        catch: () => ({
          code: "router_error" as const,
          message: "Failed to navigate with router",
        }),
        try: () => router.navigate({ to: "/" }),
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
      catch: () => ({
        code: "router_error" as const,
        message: "Failed to navigate with router",
      }),
      try: () => router.navigate({ to: "/" }),
    })

    await Effect.runPromise(routerEffect)
  }, [router, clearSelectedContent, resetNavigationState])

  /**
   * Validates prerequisites for the next item and starts it.
   * Used for "Continue" actions where the next item needs to be initialized.
   */
  const validateAndStartItem =
    useCallback(async (): Promise<NavigationStartWire> => {
      if (!selectedItem) return { _tag: "Skipped", reason: "NoSelectedItem" }

      const nextItemId = selectedItem.nextCategoryItem
      if (!nextItemId) return { _tag: "Skipped", reason: "NoNextItem" }

      const nextItem = categoryItems.find(
        (item) => item.categoryItemId === nextItemId,
      )

      if (!nextItem) return { _tag: "Skipped", reason: "NextItemNotFound" }

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
    canGoBack,
    canNavigateNext,
    canNavigatePrevious,
    exitContent,
    handleBackNavigation,
    isNextItemCompleted,
    navigateToNext,
    navigateToPrevious,
    navigationState,
    selectedItem,
    validateAndStartItem,
  }
}
