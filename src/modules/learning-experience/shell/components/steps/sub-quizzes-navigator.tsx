import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { Button } from "@/modules/shared/components/ui/button"

import type { SubQuizRef } from "../question-types/sequence-order-component"

import { ChoiceQuestionComponent } from "../question-types/choice-question-component"
import { SequenceOrderComponent } from "../question-types/sequence-order-component"
import { QuizHeader } from "./quiz-header"
import { useSubQuizNavigation } from "./use-sub-quiz-navigation"

type SubQuizzesNavigatorProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
}

// TODO: disable the button when navigating, question not validated, validating...
export function SubQuizzesNavigator({ quizItem }: SubQuizzesNavigatorProps) {
  const subQuizRef = useRef<SubQuizRef>(null)
  const { t } = useTranslation()

  const {
    canNavigateNext,
    canNavigatePrevious,
    navigateNext,
    navigatePrevious,
    navigationState,
    selectedSubQuiz,
  } = useSubQuizNavigation({ quizItem })

  const estimatedTime = selectedSubQuiz?.content?.estimatedTime ?? 0
  const [timeLeft, setTimeLeft] = useState(estimatedTime)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const isCompleted = selectedSubQuiz?.completedQuestion?.status === "completed"
  const isBusy = isValidating || navigationState.isNavigating
  const hasPreviousSubQuiz = selectedSubQuiz?.previousSubQuiz !== undefined

  const handleButtonClicked = async () => {
    if (isBusy) return

    if (isCompleted) {
      if (canNavigateNext) await navigateNext()
      return
    }

    setIsValidating(true)
    await subQuizRef.current?.validate(timeLeft)
    setIsValidating(false)
  }

  const handlePreviousClicked = async () => {
    if (isBusy || !isCompleted || !canNavigatePrevious) return
    await navigatePrevious()
  }

  return (
    <div className="flex w-full flex-col items-center">
      <QuizHeader
        isTimerRunning={isTimerRunning}
        quizItem={quizItem}
        selectedSubQuiz={selectedSubQuiz}
        setIsTimerRunning={setIsTimerRunning}
        setTimeLeft={setTimeLeft}
        subQuizRef={subQuizRef}
        timeLeft={timeLeft}
      />

      {selectedSubQuiz &&
        selectedSubQuiz.questionType === "choiceQuestions" && (
          <ChoiceQuestionComponent
            categoryId={quizItem.categoryId}
            key={selectedSubQuiz.subQuizId}
            onStopTimer={() => setIsTimerRunning(false)}
            ref={subQuizRef}
            subQuiz={selectedSubQuiz}
          />
        )}

      {selectedSubQuiz && //
        selectedSubQuiz.questionType === "sequenceOrders" && (
          <SequenceOrderComponent
            categoryId={quizItem.categoryId}
            key={selectedSubQuiz.subQuizId}
            onStopTimer={() => setIsTimerRunning(false)}
            ref={subQuizRef}
            subQuiz={selectedSubQuiz}
          />
        )}

      {selectedSubQuiz && (
        <div className="mx-auto mt-8 flex w-full max-w-2xl justify-end gap-3 px-2">
          {hasPreviousSubQuiz && (
            <Button
              className="px-8"
              disabled={isBusy || !isCompleted || !canNavigatePrevious}
              onClick={handlePreviousClicked}
              variant="secondary"
            >
              {t("quiz.previous_question")}
            </Button>
          )}
          <Button
            className="text-loops-light bg-cyan-500 px-8 hover:bg-cyan-600"
            disabled={isBusy || (isCompleted && !canNavigateNext)}
            onClick={handleButtonClicked}
          >
            {isCompleted
              ? navigationState.isNavigating
                ? t("common.starting")
                : t("quiz.next_question")
              : isValidating
                ? t("quiz.checking_answer")
                : t("quiz.check_answer")}
          </Button>
        </div>
      )}
    </div>
  )
}
