import { AwardIcon } from "@/modules/shared/components/icons/award"
import { CodeClipboardIcon } from "@/modules/shared/components/icons/code-clipboard"
import { CodeMessageIcon } from "@/modules/shared/components/icons/code-message"
import { NoteIcon } from "@/modules/shared/components/icons/note"
import { Button } from "@/modules/shared/components/ui/button"
import { OptionCard } from "../components/option-card"
import { useOnboardingForm } from "../onboarding-context"
import { useOnboardingStepper } from "../onboarding-stepper"

const levelOptions = [
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <NoteIcon />
      </div>
    ),
    id: "beginner" as const,
    title: "Beginner",
    variant: "beginner" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <CodeClipboardIcon />
      </div>
    ),
    id: "average" as const,
    title: "Average",
    variant: "average" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <AwardIcon />
      </div>
    ),
    id: "skilled" as const,
    title: "Skilled",
    variant: "skilled" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <CodeMessageIcon />
      </div>
    ),
    id: "expert" as const,
    title: "Expert",
    variant: "expert" as const,
  },
]

export function ChooseLevelStep() {
  const form = useOnboardingForm()
  const { nextStep } = useOnboardingStepper()

  const handleLevelSelect = (level: (typeof levelOptions)[0]["id"]) => {
    form.setFieldValue("level", level)
  }

  const handleContinue = () => {
    nextStep()
  }

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <h2 className="font-outfit mb-2 text-2xl font-semibold text-white">
            Choose your level
          </h2>
          <p className="font-outfit mx-auto max-w-sm text-lg leading-6 text-gray-300">
            Pick your level to ensure a personalized learning journey that
            matches your current skills.
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <form.Field name="level">
            {(field) => (
              <>
                {levelOptions.map((option) => (
                  <OptionCard
                    icon={option.icon}
                    isSelected={field.state.value === option.id}
                    key={option.id}
                    onClick={() => handleLevelSelect(option.id)}
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
