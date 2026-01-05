import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ChoiceQuestionComponent } from "../question-types/choice-question-component"
import { SequenceOrderComponent } from "../question-types/sequence-order-component"
import { useQuizStepper } from "../quiz-stepper"
import { useSubQuizNavigation } from "./use-sub-quiz-navigation"

type SubQuizzesNavigatorProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

export function SubQuizzesNavigator({ quizItem }: SubQuizzesNavigatorProps) {
  const { currentStep } = useQuizStepper()

  const { selectedSubQuiz } = useSubQuizNavigation({
    currentQuizStep: currentStep,
    quizItem,
  })

  return (
    <div>
      {selectedSubQuiz &&
        selectedSubQuiz.questionType === "choice_question" && (
          <ChoiceQuestionComponent subQuiz={selectedSubQuiz} />
        )}

      {selectedSubQuiz && selectedSubQuiz.questionType === "sequence_order" && (
        <SequenceOrderComponent subQuiz={selectedSubQuiz} />
      )}

    </div>
  )
}
