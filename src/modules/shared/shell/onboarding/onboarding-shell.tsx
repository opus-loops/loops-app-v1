import type { ReactNode } from "react"

import type { User } from "@/modules/shared/domain/entities/user"

import { usePageLoading } from "@/modules/shared/hooks/use-page-loading"

import { LoadingScreen } from "../../components/common/loading-screen"
import { OnboardingFormProvider } from "./onboarding-context"
import { OnboardingStepper } from "./onboarding-stepper"
import { ChooseGoalsStep } from "./steps/choose-goals-step"
import { ChooseLevelStep } from "./steps/choose-level-step"
import { ChooseStatusStep } from "./steps/choose-status-step"
import { WelcomeStep } from "./steps/welcome-step"

type OnboardingShellProps = {
  target: ReactNode
  user: User
}

export function OnboardingShell({ target, user }: OnboardingShellProps) {
  const isLoading = usePageLoading()

  if (isLoading) return <LoadingScreen />

  if (user.isFirstTime)
    return (
      <OnboardingFormProvider>
        <OnboardingStepper
          goal={<ChooseGoalsStep />}
          level={<ChooseLevelStep />}
          status={<ChooseStatusStep />}
          welcome={<WelcomeStep />}
        />
      </OnboardingFormProvider>
    )
  return target
}
