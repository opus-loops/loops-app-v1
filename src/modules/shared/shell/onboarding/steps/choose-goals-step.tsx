import { useTranslation } from "react-i18next"

import { ClockIcon } from "@/modules/shared/components/icons/clock"
import { Button } from "@/modules/shared/components/ui/button"

import { OptionCard } from "../components/option-card"
import { useOnboardingForm } from "../onboarding-context"
import { useOnboardingStepper } from "../onboarding-stepper"

const goalOptions = [
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "5min" as const,
    variant: "casual" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "10min" as const,
    variant: "medium" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "15min" as const,
    variant: "serious" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "20min" as const,
    variant: "hard" as const,
  },
]

export function ChooseGoalsStep() {
  const { t } = useTranslation()
  const form = useOnboardingForm()
  const { nextStep } = useOnboardingStepper()

  const handleGoalSelect = (goal: (typeof goalOptions)[0]["id"]) => {
    form.setFieldValue("dailyGoal", goal)
  }

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <h2 className="font-outfit text-loops-light mb-2 text-2xl font-semibold">
            {t("first_install.goals.title")}
          </h2>
          <p className="font-outfit mx-auto max-w-sm text-lg leading-6 text-gray-300">
            {t("first_install.goals.description")}
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <form.Field name="dailyGoal">
            {(field) => (
              <>
                {goalOptions.map((option) => (
                  <OptionCard
                    icon={option.icon}
                    isSelected={field.state.value === option.id}
                    key={option.id}
                    onClick={() => handleGoalSelect(option.id)}
                    subtitle={t(
                      `first_install.goals.options.${option.id}.subtitle`,
                    )}
                    title={t(`first_install.goals.options.${option.id}.title`)}
                    variant={option.variant}
                  />
                ))}
              </>
            )}
          </form.Field>
        </div>

        <Button
          className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
          onClick={() => nextStep()}
          type="submit"
        >
          {t("common.continue")}
        </Button>
      </div>
    </div>
  )
}
