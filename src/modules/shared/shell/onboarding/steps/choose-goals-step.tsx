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
    subtitle: "Casual",
    title: "5 min",
    variant: "casual" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "10min" as const,
    subtitle: "Medium",
    title: "10 min",
    variant: "medium" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "15min" as const,
    subtitle: "Serious",
    title: "15 min",
    variant: "serious" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <ClockIcon />
      </div>
    ),
    id: "20min" as const,
    subtitle: "Hard",
    title: "20 min",
    variant: "hard" as const,
  },
]

export function ChooseGoalsStep() {
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
            Choose your daily goals
          </h2>
          <p className="font-outfit mx-auto max-w-sm text-lg leading-6 text-gray-300">
            Tailor your learning experience by selecting the time commitment
            that suits you best.
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
                    subtitle={option.subtitle}
                    title={option.title}
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
          Continue
        </Button>
      </div>
    </div>
  )
}
