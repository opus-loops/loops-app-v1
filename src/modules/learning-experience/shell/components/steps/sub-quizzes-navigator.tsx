import { useRef, useState } from "react"

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

  const { canNavigateNext, navigateNext, navigationState, selectedSubQuiz } =
    useSubQuizNavigation({ quizItem })

  const estimatedTime = selectedSubQuiz?.content?.estimatedTime ?? 0
  const [timeLeft, setTimeLeft] = useState(estimatedTime)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const isCompleted = selectedSubQuiz?.completedQuestion?.status === "completed"

  const handleButtonClicked = async () => {
    if (isCompleted) {
      if (canNavigateNext) {
        await navigateNext()
      }
    }

    if (!isCompleted) {
      if (isValidating) return

      setIsValidating(true)
      await subQuizRef.current?.validate(timeLeft)
      setIsValidating(false)
    }
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
        <div className="mx-auto mt-8 flex w-full max-w-2xl justify-end px-2">
          <Button
            className="text-loops-light bg-cyan-500 px-8 hover:bg-cyan-600"
            onClick={handleButtonClicked}
          >
            {isCompleted
              ? navigationState.isNavigating
                ? "Starting..."
                : "Next Question"
              : isValidating
                ? "Checking..."
                : "Check Answer"}
          </Button>
        </div>
      )}
    </div>
  )
}
