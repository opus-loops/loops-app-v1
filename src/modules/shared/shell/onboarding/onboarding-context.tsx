import { useOnboarding } from "@/modules/user-onboarding/features/welcome/services/use-onboarding"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import type { PropsWithChildren } from "react"
import { createContext, useContext } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"

export const OnboardingFormSchema = z.object({
  dailyGoal: z.enum(["5min", "10min", "15min", "20min"]),
  level: z.enum(["beginner", "average", "skilled", "expert"]),
  status: z.enum(["student", "professional", "developer", "passionate"]),
})

export type OnboardingFormData = z.infer<typeof OnboardingFormSchema>

const createOnboardingForm = () => {
  const { handleOnboarding } = useOnboarding()
  const { error } = useToast()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      dailyGoal: "10min",
      level: "beginner",
      status: "student",
    } as OnboardingFormData,
    onSubmit: async ({ value }) => {
      const response = await handleOnboarding(value)

      if (response._tag === "Failure") {
        if (response.error.code === "invalid_input") {
          const { payload } = response.error.payload
          // Map backend fields to form fields
          // duration -> dailyGoal
          // codingExperience -> level
          // background -> status

          if (payload.duration) {
            form.setFieldMeta("dailyGoal", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_duration") },
              errors: [t("profile.errors.invalid_duration")],
            }))
          }

          if (payload.codingExperience) {
            form.setFieldMeta("level", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_experience") },
              errors: [t("profile.errors.invalid_experience")],
            }))
          }

          if (payload.background) {
            form.setFieldMeta("status", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_background") },
              errors: [t("profile.errors.invalid_background")],
            }))
          }
          return
        }

        error("Onboarding Failed", {
          description: "An error occurred during onboarding",
        })
      }
    },
  })

  return form
}

type OnboardingFormApi = ReturnType<typeof createOnboardingForm>

const OnboardingFormContext = createContext({} as OnboardingFormApi)

export function OnboardingFormProvider({ children }: PropsWithChildren) {
  const form = createOnboardingForm()

  return (
    <OnboardingFormContext.Provider value={form}>
      {children}
    </OnboardingFormContext.Provider>
  )
}

export function useOnboardingForm(): OnboardingFormApi {
  return useContext(OnboardingFormContext)
}
