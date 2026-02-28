import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ReactNode } from "react"
import { createContext, useContext, useState } from "react"

export type SkillStep = "welcome" | "content"

type SkillStepperContextType = {
  currentStep: SkillStep
  goToStep: (step: SkillStep) => void
}

const SkillStepperContext = createContext({} as SkillStepperContextType)

type SkillStepperProps = {
  skillItem: CategoryContentItem & { contentType: "skills" }
  welcome: ReactNode
  content: ReactNode
}

export function SkillStepper({ skillItem: _skillItem, welcome, content }: SkillStepperProps) {
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
