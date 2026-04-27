import type { PropsWithChildren } from "react"

import { createContext, useContext, useMemo, useState } from "react"

type ResetPasswordStepperContextType = {
  currentStep: ResetPasswordStep
  getStepIndex: (step: ResetPasswordStep) => number
  goToStep: (step: ResetPasswordStep) => void
  nextStep: () => void
}

const ResetPasswordStepperContext =
  createContext<ResetPasswordStepperContextType>(
    {} as ResetPasswordStepperContextType,
  )

const getResetPasswordStepIndex = (step: ResetPasswordStep) => {
  return resetPasswordStepOrder.indexOf(step)
}

const resetPasswordStepOrder = [
  "email",
  "code",
  "password",
  "success",
] as const satisfies ReadonlyArray<ResetPasswordStep>

type ResetPasswordStep = "code" | "email" | "password" | "success"

export function ResetPasswordStepperProvider({ children }: PropsWithChildren) {
  const [currentStep, setCurrentStep] = useState<ResetPasswordStep>("email")

  const value = useMemo<ResetPasswordStepperContextType>(
    () => ({
      currentStep,
      getStepIndex: getResetPasswordStepIndex,
      goToStep: (step) => {
        setCurrentStep(step)
      },
      nextStep: () => {
        const currentIndex = getResetPasswordStepIndex(currentStep)

        if (currentIndex < resetPasswordStepOrder.length - 1) {
          setCurrentStep(resetPasswordStepOrder[currentIndex + 1])
        }
      },
    }),
    [currentStep],
  )

  return (
    <ResetPasswordStepperContext.Provider value={value}>
      {children}
    </ResetPasswordStepperContext.Provider>
  )
}

export function useResetPasswordStepper() {
  return useContext(ResetPasswordStepperContext)
}
