import type { ReactNode } from "react"

import { createContext, useContext, useState } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

export type SkillStep = "content" | "welcome"

type SkillStepperContextType = {
  currentStep: SkillStep
  goToStep: (step: SkillStep) => void
}

const SkillStepperContext = createContext({} as SkillStepperContextType)

type SkillStepperProps = {
  content: ReactNode
  skillItem: { contentType: "skills" } & CategoryContentItem
  welcome: ReactNode
}

export function SkillStepper({
  content,
  skillItem: _skillItem,
  welcome,
}: SkillStepperProps) {
  const [currentStep, setCurrentStep] = useState<SkillStep>("welcome")
  const goToStep = (step: SkillStep) => setCurrentStep(step)

  return (
    <SkillStepperContext.Provider value={{ currentStep, goToStep }}>
      {currentStep === "welcome" && welcome}
      {currentStep === "content" && content}
    </SkillStepperContext.Provider>
  )
}

export function useSkillStepper() {
  return useContext(SkillStepperContext)
}
