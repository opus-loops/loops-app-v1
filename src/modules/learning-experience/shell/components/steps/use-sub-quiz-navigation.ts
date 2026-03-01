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
  /**
   * The quiz item currently being played, including category context and progress.
   *
   * @see CategoryContentItem
   * @see StartedQuiz
   */
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

/**
 * Orchestrates navigation across sub-quizzes (choice questions, sequence orders, etc.) inside a quiz.
 *
 * Dependencies:
 * - `useQuizStepper`: drives the step UI (`welcome` → `sub-quizzes` → `statistics`).
 * - `useQuizContent`: provides the ordered sub-quizzes for the current quiz.
 * - `useSelectedSubQuiz`: stores selected index and navigation state in context.
 * - `useStartChoiceQuestion` / `useStartSequenceOrder`: starts the first sub-quiz when needed.
 * - `SubQuizNavigatorManager`: determines whether navigation is allowed and performs navigation effects.
 * - `Effect`: executes navigation effects and resets state on success/failure.
 *
 * Behavior:
 * - `initializeQuiz` chooses the initial sub-quiz based on progress (completed, pointer, or start).
 * - `navigateNext` moves to the next sub-quiz or to `statistics` when none exists.
 * - `navigatePrevious` moves to the previous sub-quiz or back to `welcome`; from `statistics`,
 *   it jumps to the last sub-quiz.
 */
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

  const manager = useMemo(() => {
    return new SubQuizNavigatorManager(startChoiceQuestion, startSequenceOrder)
  }, [startChoiceQuestion, startSequenceOrder])

  const canNavigateNext = useMemo(() => {
    if (selectedSubQuiz === undefined) return currentStep === "welcome"

    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

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

    if (!previousSubQuiz) return true

    return manager.canNavigatePrevious({
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
      adjacentSubQuiz: previousSubQuiz,
      subQuizzes,
    })
  }, [manager, selectedSubQuiz, currentStep, subQuizzes, quizItem.categoryId])

  /**
   * Executes a navigation effect and synchronizes navigation context.
   *
   * On success, updates selected sub-quiz index in context and resets navigation state.
   * On failure, resets navigation state to avoid stale transitions.
   */
  const handleNavigationResult = useCallback(
    async (
      navigationEffect: Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError>,
      direction: "next" | "previous",
    ) =>
      await Effect.runPromise(
        Effect.match(navigationEffect, {
          onFailure: () => {
            resetNavigationState()
          },
          onSuccess: (targetSubQuiz) => {
            navigateToSubQuiz({ index: targetSubQuiz.index, direction })
            resetNavigationState()
          },
        }),
      ),
    [navigateToSubQuiz, resetNavigationState],
  )

  /**
   * Initializes quiz navigation based on `quizItem.itemProgress`.
   *
   * - If quiz is completed: enters review mode from the first sub-quiz.
   * - If progress pointer exists: resumes from the last started sub-quiz.
   * - Otherwise: starts the first sub-quiz then navigates into sub-quizzes.
   */
  const initializeQuiz = useCallback(async () => {
    const itemProgress = quizItem.itemProgress as StartedQuiz

    const firstSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.previousSubQuiz === undefined,
    )

    if (!firstSubQuiz) return

    if (itemProgress.status === "completed") {
      navigateToSubQuiz({
        index: firstSubQuiz.index,
        direction: "next",
      })
      goToStep("sub-quizzes")
      resetNavigationState()
      return
    }

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
    if (!selectedSubQuiz) return

    setNavigationState({
      isNavigating: true,
      navigationDirection: "next",
      previousSubQuizIndex: selectedSubQuiz.index,
    })

    const nextSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.nextSubQuiz,
    )

    if (!nextSubQuiz) {
      goToStep("statistics")
      resetNavigationState()
      return
    }

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
    if (!selectedSubQuiz) {
      if (currentStep === "statistics") {
        const lastSubQuiz = subQuizzes.find(
          (subQuiz) => subQuiz.nextSubQuiz === undefined,
        )

        if (!lastSubQuiz) return

        setNavigationState({
          isNavigating: true,
          navigationDirection: "previous",
          previousSubQuizIndex: undefined,
        })

        navigateToSubQuiz({ index: lastSubQuiz.index, direction: "previous" })
        resetNavigationState()
        return
      }
      return
    }

    setNavigationState({
      isNavigating: true,
      navigationDirection: "previous",
      previousSubQuizIndex: selectedSubQuiz.index,
    })

    const previousSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.subQuizId === selectedSubQuiz.previousSubQuiz,
    )

    if (!previousSubQuiz) {
      goToStep("welcome")
      resetNavigationState()
      return
    }

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
    canNavigateNext,
    canNavigatePrevious,

    navigateNext,
    navigatePrevious,

    initializeQuiz,
    selectedSubQuiz,
    navigationState,
  }
}
