import { useForm } from "@tanstack/react-form"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { useUpdatePreferences } from "../../hooks/use-update-preferences"
import { PreferencesFields } from "./preferences/preferences-fields"
import type { User } from "@/modules/shared/domain/entities/user"

import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

type PreferencesFormProps = {
  user: User
}

export function PreferencesForm({ user }: PreferencesFormProps) {
  const { handleUpdatePreferences } = useUpdatePreferences()
  const { error: toastError, success: toastSuccess } = useToast()
  const { i18n, t } = useTranslation()

  const initial = useMemo(() => {
    const normalizeCodingExperience = (raw: string | undefined) => {
      const v = (raw ?? "").trim()
      if (!v) return ""
      const direct = ["beginner", "average", "skilled", "expert"] as const
      if (direct.includes(v as any)) return v
      const map: Record<string, string> = {
        Average: "average",
        Beginner: "beginner",
        Expert: "expert",
        Skilled: "skilled",
      }
      return map[v] ?? ""
    }

    const normalizeBackground = (raw: string | undefined) => {
      const v = (raw ?? "").trim()
      if (!v) return ""
      const direct = [
        "student",
        "professional",
        "developer",
        "passionate",
      ] as const
      if (direct.includes(v as any)) return v
      const map: Record<string, string> = {
        Developer: "developer",
        Passionate: "passionate",
        Professional: "professional",
        Student: "student",
      }
      return map[v] ?? ""
    }

    const normalizeGoals = (raw: string | undefined) => {
      const v = (raw ?? "").trim()
      if (!v) return ""
      const direct = ["5min", "10min", "15min", "20min"] as const
      if (direct.includes(v as any)) return v
      const map: Record<string, string> = {
        "10 min": "10min",
        "15 min": "15min",
        "20 min": "20min",
        "5 min": "5min",
      }
      return map[v] ?? ""
    }

    return {
      background: normalizeBackground(user.background),
      birthDate: dateToInputValue(user.birthDate),
      city: user.city ?? "",
      codingExperience: normalizeCodingExperience(user.codingExperience),
      country: user.country ?? "",
      duration: user.duration != null ? String(user.duration) : "",
      gender: user.gender ?? "",
      goals: normalizeGoals(user.goals),
      language: user.language ?? "en",
      state: user.state ?? "",
    }
  }, [
    user.background,
    user.birthDate,
    user.city,
    user.codingExperience,
    user.country,
    user.duration,
    user.gender,
    user.goals,
    user.language,
    user.state,
  ])

  const form = useForm({
    defaultValues: {
      background: initial.background,
      birthDate: initial.birthDate,
      city: initial.city,
      codingExperience: initial.codingExperience,
      country: initial.country,
      duration: initial.duration,
      gender: initial.gender,
      goals: initial.goals,
      language: initial.language,
      state: initial.state,
    },

    onSubmit: async ({ value }) => {
      const payload: any = {}

      if ((value.birthDate ?? "") !== (initial.birthDate ?? "")) {
        payload.birthDate = (value.birthDate ?? "").trim() || undefined
      }

      if ((value.gender ?? "") !== (initial.gender ?? "")) {
        payload.gender = (value.gender ?? "").trim() || undefined
      }

      if ((value.duration ?? "") !== (initial.duration ?? "")) {
        payload.duration =
          value.duration && value.duration.trim()
            ? Number(value.duration)
            : undefined
      }

      if ((value.country ?? "") !== (initial.country ?? "")) {
        payload.country = (value.country ?? "").trim() || undefined
      }

      if ((value.state ?? "") !== (initial.state ?? "")) {
        payload.state = (value.state ?? "").trim() || undefined
      }

      if ((value.city ?? "") !== (initial.city ?? "")) {
        payload.city = (value.city ?? "").trim() || undefined
      }

      if ((value.language ?? "") !== (initial.language ?? "")) {
        payload.language = value.language
      }

      if ((value.codingExperience ?? "") !== (initial.codingExperience ?? "")) {
        payload.codingExperience =
          (value.codingExperience ?? "").trim() || undefined
      }

      if ((value.goals ?? "") !== (initial.goals ?? "")) {
        payload.goals = (value.goals ?? "").trim() || undefined
      }

      if ((value.background ?? "") !== (initial.background ?? "")) {
        payload.background = (value.background ?? "").trim() || undefined
      }

      if (Object.keys(payload).length === 0) {
        toastSuccess(t("profile.preferences_updated_success"))
        return
      }

      const result = await handleUpdatePreferences(payload)

      if (result._tag === "Failure") {
        if (result.error.code === "invalid_input") {
          const errorPayload = result.error.payload

          if (errorPayload.birthDate) {
            form.setFieldMeta("birthDate", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_birthdate") },
              errors: [t("profile.errors.invalid_birthdate")],
            }))
          }
          if (errorPayload.gender) {
            form.setFieldMeta("gender", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_gender") },
              errors: [t("profile.errors.invalid_gender")],
            }))
          }
          if (errorPayload.duration) {
            form.setFieldMeta("duration", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_duration") },
              errors: [t("profile.errors.invalid_duration")],
            }))
          }
          if (errorPayload.country) {
            form.setFieldMeta("country", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_country") },
              errors: [t("profile.errors.invalid_country")],
            }))
          }
          if (errorPayload.state) {
            form.setFieldMeta("state", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_state") },
              errors: [t("profile.errors.invalid_state")],
            }))
          }
          if (errorPayload.city) {
            form.setFieldMeta("city", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_city") },
              errors: [t("profile.errors.invalid_city")],
            }))
          }
          if (errorPayload.language) {
            form.setFieldMeta("language", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_language") },
              errors: [t("profile.errors.invalid_language")],
            }))
          }
          if (errorPayload.codingExperience) {
            form.setFieldMeta("codingExperience", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_experience") },
              errors: [t("profile.errors.invalid_experience")],
            }))
          }
          if (errorPayload.goals) {
            form.setFieldMeta("goals", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_goals") },
              errors: [t("profile.errors.invalid_goals")],
            }))
          }
          if (errorPayload.background) {
            form.setFieldMeta("background", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_background") },
              errors: [t("profile.errors.invalid_background")],
            }))
          }
          return
        }

        toastError(t("auth.login.unexpected_error"))
        return
      }

      toastSuccess(t("profile.preferences_updated_success"))
      if (payload.language && payload.language !== initial.language) {
        await i18n.changeLanguage(payload.language)
        setTimeout(() => window.location.reload(), 250)
      }
    },
  })

  return (
    <form
      className="mt-10 flex w-full flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="flex w-full flex-col items-center">
        <div className="mb-2">
          {user.avatarURL ? (
            <img
              alt={user.fullName}
              className="border-loops-light h-24 w-24 rounded-full border-4 object-cover"
              src={user.avatarURL}
            />
          ) : (
            <div className="bg-loops-l flex h-24 w-24 items-center justify-center rounded-full">
              <div className="text-loops-light h-12 w-12">
                <UserIcon />
              </div>
            </div>
          )}
        </div>

        <h2 className="font-outfit text-loops-pink mb-10 text-2xl font-bold">
          {user.fullName}
        </h2>
      </div>

      <PreferencesFields form={form} />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            className="bg-loops-cyan hover:bg-loops-cyan/90 text-loops-light mt-10 h-14 w-full rounded-xl text-lg font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? t("common.saving") : t("profile.save_preferences")}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}

function dateToInputValue(date: Date | undefined) {
  if (!date) return ""
  const iso = date.toISOString()
  return iso.split("T")[0] ?? ""
}
