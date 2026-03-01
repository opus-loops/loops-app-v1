import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import type { User } from "@/modules/shared/domain/entities/user"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { useMemo } from "react"
import { useUpdatePreferences } from "../../hooks/use-update-preferences"
import { PreferencesFields } from "./preferences/preferences-fields"

type PreferencesFormProps = {
  user: User
}

function dateToInputValue(date: Date | undefined) {
  if (!date) return ""
  const iso = date.toISOString()
  return iso.split("T")[0] ?? ""
}

export function PreferencesForm({ user }: PreferencesFormProps) {
  const { handleUpdatePreferences } = useUpdatePreferences()
  const { error: toastError, success: toastSuccess } = useToast()

  const initial = useMemo(() => {
    const normalizeCodingExperience = (raw: string | undefined) => {
      const v = (raw ?? "").trim()
      if (!v) return ""
      const direct = ["beginner", "average", "skilled", "expert"] as const
      if (direct.includes(v as any)) return v
      const map: Record<string, string> = {
        Beginner: "beginner",
        Average: "average",
        Skilled: "skilled",
        Expert: "expert",
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
        Student: "student",
        Professional: "professional",
        Developer: "developer",
        Passionate: "passionate",
      }
      return map[v] ?? ""
    }

    const normalizeGoals = (raw: string | undefined) => {
      const v = (raw ?? "").trim()
      if (!v) return ""
      const direct = ["5min", "10min", "15min", "20min"] as const
      if (direct.includes(v as any)) return v
      const map: Record<string, string> = {
        "5 min": "5min",
        "10 min": "10min",
        "15 min": "15min",
        "20 min": "20min",
      }
      return map[v] ?? ""
    }

    return {
      birthDate: dateToInputValue(user.birthDate),
      gender: user.gender ?? "",
      duration: user.duration != null ? String(user.duration) : "",
      country: user.country ?? "",
      state: user.state ?? "",
      city: user.city ?? "",
      language: user.language ?? "en",
      codingExperience: normalizeCodingExperience(user.codingExperience),
      goals: normalizeGoals(user.goals),
      background: normalizeBackground(user.background),
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
      birthDate: initial.birthDate,
      gender: initial.gender,
      duration: initial.duration,
      country: initial.country,
      state: initial.state,
      city: initial.city,
      language: initial.language,
      codingExperience: initial.codingExperience,
      goals: initial.goals,
      background: initial.background,
    },

    validators: {
      onSubmitAsync: async ({ value }) => {
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

        if (
          (value.codingExperience ?? "") !== (initial.codingExperience ?? "")
        ) {
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
          toastSuccess("Preferences updated successfully.")
          return null
        }

        const result = await handleUpdatePreferences(payload)

        if (result._tag === "Failure") {
          if (result.error.code === "invalid_input") {
            return {
              birthDate: result.error.payload.birthDate,
              gender: result.error.payload.gender,
              duration: result.error.payload.duration,
              country: result.error.payload.country,
              state: result.error.payload.state,
              city: result.error.payload.city,
              language: result.error.payload.language,
              codingExperience: result.error.payload.codingExperience,
              goals: result.error.payload.goals,
              background: result.error.payload.background,
            }
          }

          const message =
            "message" in result.error
              ? result.error.message
              : "An unexpected error occurred."
          toastError(message)
          return null
        }

        toastSuccess("Preferences updated successfully.")
        if ((payload.language ?? "") && payload.language !== initial.language) {
          setTimeout(() => window.location.reload(), 250)
        }
        return null
      },
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
      className="mt-10 flex w-full flex-col"
    >
      <div className="flex w-full flex-col items-center">
        <div className="mb-2">
          {user.avatarURL ? (
            <img
              src={user.avatarURL}
              alt={user.fullName}
              className="border-loops-light h-24 w-24 rounded-full border-4 object-cover"
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
            type="submit"
            disabled={!canSubmit}
            className="bg-loops-cyan hover:bg-loops-cyan/90 text-loops-light mt-10 h-14 w-full rounded-xl text-lg font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
