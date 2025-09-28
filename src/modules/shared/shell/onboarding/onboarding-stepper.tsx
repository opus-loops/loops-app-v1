import { Button } from "@/modules/shared/components/ui/button"
import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"
import { ProgressBar } from "./components/progress-bar"

export type OnboardingStep = "goal" | "level" | "status" | "welcome"

type StepperContextType = {
  currentStep: OnboardingStep
  getStepIndex: (step: OnboardingStep) => number
  getStepProgress: () => number
  goToStep: (step: OnboardingStep) => void
  nextStep: () => void
  previousStep: () => void
}

const StepperContext = createContext({} as StepperContextType)

const stepOrder: Array<OnboardingStep> = ["level", "goal", "status", "welcome"]

type OnboardingStepperProps = {
  goal: ReactNode
  level: ReactNode
  status: ReactNode
  welcome: ReactNode
}

export function OnboardingStepper({
  goal,
  level,
  status,
  welcome,
}: OnboardingStepperProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("level")

  const getStepIndex = (step: OnboardingStep): number => {
    return stepOrder.indexOf(step)
  }

  const nextStep = () => {
    const currentIndex = getStepIndex(currentStep)
    if (currentIndex < stepOrder.length - 1)
      setCurrentStep(stepOrder[currentIndex + 1])
  }

  const previousStep = () => {
    const currentIndex = getStepIndex(currentStep)
    if (currentIndex > 0) setCurrentStep(stepOrder[currentIndex - 1])
  }

  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step)
  }

  const getStepProgress = (): number => {
    const currentIndex = getStepIndex(currentStep)
    return ((currentIndex + 1) / stepOrder.length) * 100
  }

  const value: StepperContextType = {
    currentStep,
    getStepIndex,
    getStepProgress,
    goToStep,
    nextStep,
    previousStep,
  }

  return (
    <StepperContext.Provider value={value}>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
        <div className="flex h-screen flex-col">
          <div className="flex items-center px-8 py-6">
            {getStepIndex(currentStep) !== 0 && (
              <div className="mr-4 flex h-10 w-10 items-center justify-center">
                <Button onClick={() => previousStep()} variant="ghost">
                  <svg
                    className="text-loops-light size-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Button>
              </div>
            )}
            <ProgressBar />
          </div>
          <div className="h-full flex-1">
            {currentStep === "level" && level}
            {currentStep === "status" && status}
            {currentStep === "goal" && goal}
            {currentStep === "welcome" && welcome}
          </div>
        </div>
      </div>
    </StepperContext.Provider>
  )
}

export function useOnboardingStepper() {
  return useContext(StepperContext)
}
