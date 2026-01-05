import { useSelectedSubQuiz } from "@/modules/learning-experience/contexts/selected-sub-quiz-context"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useQuizContent } from "@/modules/shared/shell/selected_content/services/use-quiz-content"
import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import { useCallback, useMemo } from "react"
import { QuizStep } from "../quiz-stepper"
import { SubQuizNavigatorManager } from "./navigation/managers/sub-quiz-navigator-manager"
import { SubQuizNavigationError } from "./sub-quiz-navigation-types"

type UseSubQuizNavigationProps = {
  quizItem: CategoryContentItem
  currentQuizStep: QuizStep
}

export function useSubQuizNavigation({
  quizItem,
  currentQuizStep,
}: UseSubQuizNavigationProps) {
  const { subQuizzes } = useQuizContent({
    quizId: quizItem.itemId,
    categoryId: quizItem.categoryId,
  })

  const {
    selectedSubQuiz,
    navigationState,
    navigateToSubQuiz,
    setNavigationState,
    resetNavigationState,
  } = useSelectedSubQuiz()

  const startChoiceQuestion = useStartChoiceQuestion()
  const startSequenceOrder = useStartSequenceOrder()

  // Create navigation manager
  const manager = useMemo(() => {
    return new SubQuizNavigatorManager(
      startChoiceQuestion,
      startSequenceOrder,
    )
  }, [startChoiceQuestion, startSequenceOrder])

  // Navigation capabilities
  const canNavigateNext = useMemo(() => {
    if (selectedSubQuiz === undefined) {
      if (currentQuizStep === "welcome") return true
      else return false
    }

    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

    return manager.canNavigateNext({
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
      adjacentSubQuiz: nextSubQuiz,
      subQuizzes,
    })
  }, [
    manager,
    selectedSubQuiz,
    currentQuizStep,
    subQuizzes,
    quizItem.categoryId,
  ])

  const canNavigatePrevious = useMemo(() => {
    if (selectedSubQuiz === undefined) {
      if (currentQuizStep === "statistics") return true
      else return false
    }

    const previousSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.previousSubQuiz,
    )

    return manager.canNavigatePrevious({
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
      adjacentSubQuiz: previousSubQuiz,
      subQuizzes,
    })
  }, [
    manager,
    selectedSubQuiz,
    currentQuizStep,
    subQuizzes,
    quizItem.categoryId,
  ])

  // Handle navigation result
  const handleNavigationResult = useCallback(
    async (
      navigationEffect: Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>,
      direction: "next" | "previous",
    ) =>
      await Effect.runPromise(
        Effect.match(navigationEffect, {
          onFailure: () => {
            // Reset navigation state on failure
            resetNavigationState()
          },
          onSuccess: (targetSubQuiz) => {
            // Update context with navigation result
            navigateToSubQuiz({ subQuiz: targetSubQuiz, direction })

            // Reset navigation state
            resetNavigationState()
          },
        }),
      ),
    [navigateToSubQuiz, resetNavigationState],
  )

  // Navigation actions
  const navigateNext = useCallback(async () => {
    // Handle welcome step: navigate to first sub-quiz
    if (!selectedSubQuiz) {
      if (currentQuizStep === "welcome") {
        const firstSubQuiz = subQuizzes.find(
          (subQuiz) => subQuiz.previousSubQuiz === undefined,
        )

        if (!firstSubQuiz) return

        // Set navigation state
        setNavigationState({
          isNavigating: true,
          navigationDirection: "next",
          previousSubQuiz: undefined,
        })

        // Navigate directly to first sub-quiz
        navigateToSubQuiz({
          subQuiz: firstSubQuiz,
          direction: "next",
        })

        resetNavigationState()
        return
      }
    }

    // Regular navigation: requires selectedSubQuiz
    if (!selectedSubQuiz) return

    // Set navigation state
    setNavigationState({
      isNavigating: true,
      navigationDirection: "next",
      previousSubQuiz: selectedSubQuiz,
    })

    // Find next sub-quiz
    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

    // Perform navigation
    await handleNavigationResult(
      manager.navigateNext({
        categoryId: quizItem.categoryId,
        currentSubQuiz: selectedSubQuiz,
        adjacentSubQuiz: nextSubQuiz,
        subQuizzes,
      }),
      "next",
    )
  }, [
    selectedSubQuiz,
    currentQuizStep,
    subQuizzes,
    manager,
    setNavigationState,
    handleNavigationResult,
    navigateToSubQuiz,
    resetNavigationState,
  ])

  const navigatePrevious = useCallback(async () => {
    // Regular navigation: requires selectedSubQuiz
    if (!selectedSubQuiz) return
    // Handle statistics step: navigate to last sub-quiz
    if (!selectedSubQuiz) {
      if (currentQuizStep === "statistics") {
        const lastSubQuiz = subQuizzes.find(
          (subQuiz) => subQuiz.nextSubQuiz === undefined,
        )

        if (!lastSubQuiz) return

        // Set navigation state
        setNavigationState({
          isNavigating: true,
          navigationDirection: "previous",
          previousSubQuiz: undefined,
        })

        // Navigate directly to last sub-quiz
        navigateToSubQuiz({ subQuiz: lastSubQuiz, direction: "previous" })
        resetNavigationState()
        return
      }
    }

    // Regular navigation: requires selectedSubQuiz
    if (!selectedSubQuiz) return

    // Set navigation state
    setNavigationState({
      isNavigating: true,
      navigationDirection: "previous",
      previousSubQuiz: selectedSubQuiz,
    })

    // Find previous sub-quiz
    const previousSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.previousSubQuiz,
    )

    // Perform navigation
    await handleNavigationResult(
      manager.navigatePrevious({
        categoryId: quizItem.categoryId,
        currentSubQuiz: selectedSubQuiz,
        adjacentSubQuiz: previousSubQuiz,
        subQuizzes,
      }),
      "previous",
    )
  }, [
    selectedSubQuiz,
    currentQuizStep,
    subQuizzes,
    manager,
    setNavigationState,
    handleNavigationResult,
    navigateToSubQuiz,
    resetNavigationState,
  ])

  return {
    // Navigation capabilities
    canNavigateNext,
    canNavigatePrevious,

    // Navigation actions
    navigateNext,
    navigatePrevious,

    // Current state
    selectedSubQuiz,
    navigationState,
  }
}
