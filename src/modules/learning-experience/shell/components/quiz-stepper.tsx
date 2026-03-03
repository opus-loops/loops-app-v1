import { createContext, useContext, useState } from "react"
import type { ReactNode } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

export type QuizStep = "statistics" | "sub-quizzes" | "welcome"

type QuizStepperContextType = {
  currentStep: QuizStep
  goToStep: (step: QuizStep) => void
}

const QuizStepperContext = createContext({} as QuizStepperContextType)

type QuizStepperProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
  statistics: ReactNode
  subQuizzesNavigator: ReactNode
  welcome: ReactNode
}

export function QuizStepper({
  quizItem,
  statistics,
  subQuizzesNavigator,
  welcome,
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
