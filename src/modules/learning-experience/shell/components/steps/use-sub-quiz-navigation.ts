import { Effect } from "effect"
import { useCallback, useMemo } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"

import { useSelectedSubQuiz } from "@/modules/learning-experience/contexts/selected-sub-quiz-context"
import { useQuizContent } from "@/modules/shared/shell/selected_content/services/use-quiz-content"
import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"

import type { SubQuizNavigationError } from "./sub-quiz-navigation-types"

import { useQuizStepper } from "../quiz-stepper"
import { SubQuizNavigatorManager } from "./navigation/managers/sub-quiz-navigator-manager"

type UseSubQuizNavigationProps = {
  /**
   * The quiz item currently being played, including category context and progress.
   *
   * @see CategoryContentItem
   * @see StartedQuiz
   */
  quizItem: { contentType: "quizzes" } & CategoryContentItem
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
  const { startedQuiz, subQuizzes } = useQuizContent({
    categoryId: quizItem.categoryId,
    quizId: quizItem.itemId,
  })

  const {
    navigateToSubQuiz,
    navigationState,
    resetNavigationState,
    selectedSubQuizIndex,
    setNavigationState,
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
      adjacentSubQuiz: nextSubQuiz,
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
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
      adjacentSubQuiz: previousSubQuiz,
      categoryId: quizItem.categoryId,
      currentSubQuiz: selectedSubQuiz,
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
            navigateToSubQuiz({ direction, index: targetSubQuiz.index })
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
    const firstSubQuiz = subQuizzes.find(
      (subQuiz) => subQuiz.previousSubQuiz === undefined,
    )

    if (!firstSubQuiz) return

    if (startedQuiz?.status === "completed") {
      navigateToSubQuiz({
        direction: "next",
        index: firstSubQuiz.index,
      })
      goToStep("sub-quizzes")
      resetNavigationState()
      return
    }

    const startFirstSubQuiz = async () => {
      if (firstSubQuiz.questionType === "choiceQuestions") {
        await startChoiceQuestion.handleStartChoiceQuestion({
          categoryId: quizItem.categoryId,
          questionId: firstSubQuiz.questionId,
          quizId: quizItem.itemId,
        })
      } else {
        await startSequenceOrder.handleStartSequenceOrder({
          categoryId: quizItem.categoryId,
          questionId: firstSubQuiz.questionId,
          quizId: quizItem.itemId,
        })
      }
    }

    if (startedQuiz?.progressPointer) {
      const lastStartedSubQuiz = subQuizzes.find(
        (sq) => sq.subQuizId === startedQuiz.progressPointer,
      )
      if (lastStartedSubQuiz) {
        navigateToSubQuiz({
          direction: "next",
          index: lastStartedSubQuiz.index,
        })
        goToStep("sub-quizzes")
        resetNavigationState()
        return
      }
    }

    if (!startedQuiz?.progressPointer) {
      await startFirstSubQuiz()
      navigateToSubQuiz({ direction: "next", index: firstSubQuiz.index })
      goToStep("sub-quizzes")
      resetNavigationState()
    }
  }, [
    startedQuiz,
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
        adjacentSubQuiz: nextSubQuiz,
        categoryId: quizItem.categoryId,
        currentSubQuiz: selectedSubQuiz,
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

        navigateToSubQuiz({ direction: "previous", index: lastSubQuiz.index })
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
        adjacentSubQuiz: previousSubQuiz,
        categoryId: quizItem.categoryId,
        currentSubQuiz: selectedSubQuiz,
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

    initializeQuiz,
    navigateNext,

    navigatePrevious,
    navigationState,
    selectedSubQuiz,
    startedQuiz,
  }
}
