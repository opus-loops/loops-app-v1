import { useSelectedSubQuiz } from "@/modules/learning-experience/contexts/selected-sub-quiz-context"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { StartedQuiz } from "@/modules/shared/domain/entities/started-quiz"
import { useQuizContent } from "@/modules/shared/shell/selected_content/services/use-quiz-content"
import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import { useCallback, useMemo } from "react"
import { useQuizStepper } from "../quiz-stepper"
import { SubQuizNavigatorManager } from "./navigation/managers/sub-quiz-navigator-manager"
import { SubQuizNavigationError } from "./sub-quiz-navigation-types"

type UseSubQuizNavigationProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

export function useSubQuizNavigation({ quizItem }: UseSubQuizNavigationProps) {
  const { currentStep, goToStep } = useQuizStepper()
  const { subQuizzes } = useQuizContent({
    quizId: quizItem.itemId,
    categoryId: quizItem.categoryId,
  })

  const {
    selectedSubQuizIndex,
    navigationState,
    navigateToSubQuiz,
    setNavigationState,
    resetNavigationState,
  } = useSelectedSubQuiz()

  const selectedSubQuiz =
    selectedSubQuizIndex !== undefined
      ? subQuizzes[selectedSubQuizIndex]
      : undefined

  const startChoiceQuestion = useStartChoiceQuestion()
  const startSequenceOrder = useStartSequenceOrder()

  // Create navigation manager
  const manager = useMemo(() => {
    return new SubQuizNavigatorManager(startChoiceQuestion, startSequenceOrder)
  }, [startChoiceQuestion, startSequenceOrder])

  // Navigation capabilities
  const canNavigateNext = useMemo(() => {
    if (selectedSubQuiz === undefined) return currentStep === "welcome"

    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

    // Allow navigation to statistics if no next sub-quiz
    if (!nextSubQuiz) return true

    return manager.canNavigateNext({
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
      adjacentSubQuiz: nextSubQuiz,
      subQuizzes,
    })
  }, [manager, selectedSubQuiz, currentStep, subQuizzes, quizItem.categoryId])

  const canNavigatePrevious = useMemo(() => {
    if (selectedSubQuiz === undefined) {
      if (currentStep === "statistics") return true
      else return false
    }

    const previousSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.previousSubQuiz,
    )

    // Allow navigation to welcome if no previous sub-quiz
    if (!previousSubQuiz) return true

    return manager.canNavigatePrevious({
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
      adjacentSubQuiz: previousSubQuiz,
      subQuizzes,
    })
  }, [manager, selectedSubQuiz, currentStep, subQuizzes, quizItem.categoryId])

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
            navigateToSubQuiz({ index: targetSubQuiz.index, direction })

            // Reset navigation state
            resetNavigationState()
          },
        }),
      ),
    [navigateToSubQuiz, resetNavigationState],
  )

  // Navigation actions
  const initializeQuiz = useCallback(async () => {
    const itemProgress = quizItem.itemProgress as StartedQuiz

    const firstSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.previousSubQuiz === undefined,
    )

    if (!firstSubQuiz) return

    // Case 1: Quiz is completed -> Start from beginning (review mode)
    if (itemProgress.status === "completed") {
      navigateToSubQuiz({
        index: firstSubQuiz.index,
        direction: "next",
      })
      goToStep("sub-quizzes")
      resetNavigationState()
      return
    }

    // TODO: REFACTOR THIS
    const startFirstSubQuiz = async () => {
      if (firstSubQuiz.questionType === "choiceQuestions") {
        await startChoiceQuestion.handleStartChoiceQuestion({
          categoryId: quizItem.categoryId,
          quizId: quizItem.itemId,
          questionId: firstSubQuiz.questionId,
        })
      } else if (firstSubQuiz.questionType === "sequenceOrders") {
        await startSequenceOrder.handleStartSequenceOrder({
          categoryId: quizItem.categoryId,
          quizId: quizItem.itemId,
          questionId: firstSubQuiz.questionId,
        })
      }
    }

    // Case 2: Resume from last started sub-quiz (progressPointer)
    if (itemProgress.progressPointer) {
      const lastStartedSubQuiz = subQuizzes.find(
        (sq) => sq.subQuizId === itemProgress.progressPointer,
      )
      if (lastStartedSubQuiz) {
        navigateToSubQuiz({
          index: lastStartedSubQuiz.index,
          direction: "next",
        })
        goToStep("sub-quizzes")
        resetNavigationState()
        return
      }
    }

    // Case 3: All started/completed -> Go to first sub-quiz
    // If we have progress but no pointer, and we are not at start (implied by having progress),
    // we default to first sub-quiz (user requirement: "if all ... set the first").
    // Also covers "if there's no started sub quiz" (if that could happen with itemProgress present but no pointer? unlikely)
    // But if completedQuestions == 0 and no pointer? That means started but no progress?
    if (!itemProgress.progressPointer) {
      await startFirstSubQuiz()
      navigateToSubQuiz({ index: firstSubQuiz.index, direction: "next" })
      goToStep("sub-quizzes")
      resetNavigationState()
    }
  }, [
    quizItem,
    subQuizzes,
    startChoiceQuestion,
    startSequenceOrder,
    navigateToSubQuiz,
    resetNavigationState,
    goToStep,
  ])

  const navigateNext = useCallback(async () => {
    // Regular navigation: requires selectedSubQuiz
    if (!selectedSubQuiz) return

    // Set navigation state
    setNavigationState({
      isNavigating: true,
      navigationDirection: "next",
      previousSubQuizIndex: selectedSubQuiz.index,
    })

    // Find next sub-quiz
    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

    // If no next sub-quiz, go to statistics
    if (!nextSubQuiz) {
      goToStep("statistics")
      resetNavigationState()
      return
    }

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
    currentStep,
    subQuizzes,
    manager,
    setNavigationState,
    handleNavigationResult,
    navigateToSubQuiz,
    resetNavigationState,
    goToStep,
  ])

  const navigatePrevious = useCallback(async () => {
    // Regular navigation: requires selectedSubQuiz
    if (!selectedSubQuiz) {
      // Handle statistics step: navigate to last sub-quiz
      if (currentStep === "statistics") {
        const lastSubQuiz = subQuizzes.find(
          (subQuiz) => subQuiz.nextSubQuiz === undefined,
        )

        if (!lastSubQuiz) return

        // Set navigation state
        setNavigationState({
          isNavigating: true,
          navigationDirection: "previous",
          previousSubQuizIndex: undefined,
        })

        // Navigate directly to last sub-quiz
        navigateToSubQuiz({ index: lastSubQuiz.index, direction: "previous" })
        resetNavigationState()
        return
      }
      return
    }

    // Set navigation state
    setNavigationState({
      isNavigating: true,
      navigationDirection: "previous",
      previousSubQuizIndex: selectedSubQuiz.index,
    })

    // Find previous sub-quiz
    const previousSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.previousSubQuiz,
    )

    // If no previous sub-quiz, go to welcome
    if (!previousSubQuiz) {
      goToStep("welcome")
      resetNavigationState()
      return
    }

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
    currentStep,
    subQuizzes,
    manager,
    setNavigationState,
    handleNavigationResult,
    navigateToSubQuiz,
    resetNavigationState,
    goToStep,
  ])

  return {
    // Navigation capabilities
    canNavigateNext,
    canNavigatePrevious,

    // Navigation actions
    navigateNext,
    navigatePrevious,

    initializeQuiz,
    // Current state
    selectedSubQuiz,
    navigationState,
  }
}
