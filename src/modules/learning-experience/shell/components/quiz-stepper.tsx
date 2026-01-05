import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"

export type QuizStep = "welcome" | "sub-quizzes" | "statistics"

type QuizStepperContextType = {
  currentStep: QuizStep
  goToStep: (step: QuizStep) => void
}

const QuizStepperContext = createContext({} as QuizStepperContextType)

type QuizStepperProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
  welcome: ReactNode
  subQuizzesNavigator: ReactNode
  statistics: ReactNode
}

export function QuizStepper({
  quizItem,
  welcome,
  subQuizzesNavigator,
  statistics,
}: QuizStepperProps) {
  const [currentStep, setCurrentStep] = useState<QuizStep>("welcome")
  const goToStep = (step: QuizStep) => setCurrentStep(step)

  return (
    <QuizStepperContext.Provider value={{ currentStep, goToStep }}>
      {currentStep === "welcome" && welcome}
      {currentStep === "sub-quizzes" && subQuizzesNavigator}
      {currentStep === "statistics" && statistics}
    </QuizStepperContext.Provider>
  )
}

export function useQuizStepper() {
  return useContext(QuizStepperContext)
}
