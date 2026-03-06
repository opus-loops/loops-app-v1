import { useTranslation } from "react-i18next"
import { OptionCard } from "../components/option-card"
import { useOnboardingForm } from "../onboarding-context"
import { useOnboardingStepper } from "../onboarding-stepper"
import { BriefCaseIcon } from "@/modules/shared/components/icons/brief-case"
import { GameIcon } from "@/modules/shared/components/icons/game"
import { MonitorIcon } from "@/modules/shared/components/icons/monitor"
import { TeacherIcon } from "@/modules/shared/components/icons/teacher"
import { Button } from "@/modules/shared/components/ui/button"

const statusOptions = [
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <TeacherIcon />
      </div>
    ),
    id: "student" as const,
    variant: "student" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <BriefCaseIcon />
      </div>
    ),
    id: "professional" as const,
    variant: "professional" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <MonitorIcon />
      </div>
    ),
    id: "developer" as const,
    variant: "developer" as const,
  },
  {
    icon: (
      <div className="text-loops-light size-9 shrink-0 grow-0">
        <GameIcon />
      </div>
    ),
    id: "passionate" as const,
    variant: "passionate" as const,
  },
]

export function ChooseStatusStep() {
  const { t } = useTranslation()
  const form = useOnboardingForm()
  const { nextStep } = useOnboardingStepper()

  const handleStatusSelect = (status: (typeof statusOptions)[0]["id"]) => {
    form.setFieldValue("status", status)
  }

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-8 text-center">
          <h2 className="font-outfit text-loops-light mb-2 text-2xl font-semibold">
            {t("first_install.status.title")}
          </h2>
          <p className="font-outfit mx-auto max-w-sm text-lg leading-8 text-gray-300">
            {t("first_install.status.description")}
          </p>
        </div>

        <div className="mb-8 space-y-3">
          <form.Field name="status">
            {(field) => (
              <>
                {statusOptions.map((option) => (
                  <OptionCard
                    icon={option.icon}
                    isSelected={field.state.value === option.id}
                    key={option.id}
                    onClick={() => handleStatusSelect(option.id)}
                    title={t(`first_install.status.options.${option.id}.title`)}
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
