import { Button } from "@/modules/shared/components/ui/button"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useRef, useState } from "react"
import { ChoiceQuestionComponent } from "../question-types/choice-question-component"
import {
  SequenceOrderComponent,
  SubQuizRef,
} from "../question-types/sequence-order-component"
import { QuizHeader } from "./quiz-header"
import { useSubQuizNavigation } from "./use-sub-quiz-navigation"

type SubQuizzesNavigatorProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

// TODO: disable the button when navigating, question not validated, validating...
export function SubQuizzesNavigator({ quizItem }: SubQuizzesNavigatorProps) {
  const subQuizRef = useRef<SubQuizRef>(null)

  const { selectedSubQuiz, navigateNext, canNavigateNext, navigationState } =
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
        quizItem={quizItem}
        selectedSubQuiz={selectedSubQuiz}
        timeLeft={timeLeft}
        setTimeLeft={setTimeLeft}
        isTimerRunning={isTimerRunning}
        setIsTimerRunning={setIsTimerRunning}
        subQuizRef={subQuizRef}
      />

      {selectedSubQuiz &&
        selectedSubQuiz.questionType === "choiceQuestions" && (
          <ChoiceQuestionComponent
            key={selectedSubQuiz.subQuizId}
            ref={subQuizRef}
            categoryId={quizItem.categoryId}
            subQuiz={selectedSubQuiz}
            onStopTimer={() => setIsTimerRunning(false)}
          />
        )}

      {selectedSubQuiz && //
        selectedSubQuiz.questionType === "sequenceOrders" && (
          <SequenceOrderComponent
            key={selectedSubQuiz.subQuizId}
            ref={subQuizRef}
            categoryId={quizItem.categoryId}
            subQuiz={selectedSubQuiz}
            onStopTimer={() => setIsTimerRunning(false)}
          />
        )}

      {selectedSubQuiz && (
        <div className="mx-auto mt-8 flex w-full max-w-2xl justify-end px-2">
          <Button
            onClick={handleButtonClicked}
            className="text-loops-light bg-cyan-500 px-8 hover:bg-cyan-600"
          >
            {isCompleted
              ? navigationState?.isNavigating
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
