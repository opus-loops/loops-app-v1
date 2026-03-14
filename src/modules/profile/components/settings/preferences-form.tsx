import { useForm } from "@tanstack/react-form"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"

import countriesCitiesData from "@/data/countries-cities.json"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

import { useUpdatePreferences } from "../../hooks/use-update-preferences"
import { BirthDateCalendar } from "./preferences/birth-date-calendar"
import {
  backgroundOptions,
  codingExperienceOptions,
  durationOptions,
  goalsOptions,
} from "./preferences/constants"
import { GenderRadioGroup } from "./preferences/gender-radio-group"
import { InlineSelect } from "./preferences/inline-select"
import { LanguageSelectGroup } from "./preferences/language-select-group"
import { PreferenceField } from "./preferences/preference-field"
import { PreferencesGroup } from "./preferences/preferences-group"

type CountriesCities = {
  Countries: Array<{
    CountryName: string
    States: Array<{
      Cities: Array<string>
      StateName: string
    }>
  }>
}

type FieldErrorProps = {
  errors: Array<unknown>
  isTouched?: boolean
}

type PreferencesFormProps = {
  user: User
}

export function PreferencesForm({ user }: PreferencesFormProps) {
  const { handleUpdatePreferences } = useUpdatePreferences()
  const { error: toastError, success: toastSuccess } = useToast()
  const { i18n, t } = useTranslation()

  const dataset = countriesCitiesData as CountriesCities

  const countryOptions = useMemo(() => {
    const countries = dataset?.Countries ?? []
    return toOptions(sortStrings(countries.map((c) => c.CountryName)))
  }, [dataset])

  const initial = useMemo(() => {
    const normalizeCodingExperience = (raw: string | undefined) => {
      const value = raw?.trim()
      if (!value) return ""
      const direct = ["beginner", "average", "skilled", "expert"] as const
      if (direct.includes(value as (typeof direct)[number])) return value
      const map: Record<string, string> = {
        Average: "average",
        Beginner: "beginner",
        Expert: "expert",
        Skilled: "skilled",
      }
      return map[value] ?? ""
    }

    const normalizeBackground = (raw: string | undefined) => {
      const value = raw?.trim()
      if (!value) return ""
      const direct = [
        "student",
        "professional",
        "developer",
        "passionate",
      ] as const
      if (direct.includes(value as (typeof direct)[number])) return value
      const map: Record<string, string> = {
        Developer: "developer",
        Passionate: "passionate",
        Professional: "professional",
        Student: "student",
      }
      return map[value] ?? ""
    }

    const normalizeGoals = (raw: string | undefined) => {
      const value = raw?.trim()
      if (!value) return ""
      const direct = ["5min", "10min", "15min", "20min"] as const
      if (direct.includes(value as (typeof direct)[number])) return value
      const map: Record<string, string> = {
        "10 min": "10min",
        "15 min": "15min",
        "20 min": "20min",
        "5 min": "5min",
      }
      return map[value] ?? ""
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
      const payload: Record<string, any> = {}

      if (value.birthDate !== initial.birthDate) {
        payload.birthDate = value.birthDate || undefined
      }

      if (value.gender !== initial.gender) {
        payload.gender = value.gender || undefined
      }

      if (value.duration !== initial.duration) {
        payload.duration =
          value.duration && value.duration.trim()
            ? Number(value.duration)
            : undefined
      }

      if (value.country !== initial.country) {
        payload.country = value.country || undefined
      }

      if (value.state !== initial.state) {
        payload.state = value.state || undefined
      }

      if (value.city !== initial.city) {
        payload.city = value.city || undefined
      }

      if (value.language !== initial.language) {
        payload.language = value.language
      }

      if (value.codingExperience !== initial.codingExperience) {
        payload.codingExperience = value.codingExperience || undefined
      }

      if (value.goals !== initial.goals) {
        payload.goals = value.goals || undefined
      }

      if (value.background !== initial.background) {
        payload.background = value.background || undefined
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

      <div className="flex flex-col gap-6">
        <PreferencesGroup
          subtitle={t("profile.sections.personal_subtitle")}
          title={t("profile.sections.personal")}
        >
          <form.Field name="birthDate">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.birth_date")}
                variant="plain"
              >
                <BirthDateCalendar
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>

          <form.Field name="gender">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.gender")}
                variant="plain"
              >
                <GenderRadioGroup
                  onChange={field.handleChange}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>

          <form.Field name="language">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.language")}
                variant="plain"
              >
                <LanguageSelectGroup
                  onChange={field.handleChange}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>
        </PreferencesGroup>

        <form.Subscribe
          selector={(state) => [state.values.country, state.values.state]}
        >
          {(values) => {
            const [country, stateName] = values as [string, string]
            const selectedCountry = (dataset.Countries ?? []).find(
              (c) => c.CountryName === country,
            )
            const stateOptions = toOptions(
              sortStrings(
                (selectedCountry?.States ?? []).map((s) => s.StateName),
              ),
            )
            const selectedState = (selectedCountry?.States ?? []).find(
              (s) => s.StateName === stateName,
            )
            const cityOptions = toOptions(
              sortStrings(selectedState?.Cities ?? []),
            )

            return (
              <PreferencesGroup
                subtitle={t("profile.sections.location_subtitle")}
                title={t("profile.sections.location")}
              >
                <form.Field name="country">
                  {(field) => (
                    <PreferenceField
                      error={getFieldError(field.state.meta)}
                      htmlFor={field.name}
                      label={t("profile.fields.country")}
                    >
                      <InlineSelect
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(next) => {
                          field.handleChange(next)
                          form.setFieldValue("state", "")
                          form.setFieldValue("city", "")
                        }}
                        options={countryOptions}
                        placeholder={t("profile.placeholders.select_country")}
                        value={field.state.value}
                      />
                    </PreferenceField>
                  )}
                </form.Field>

                <form.Field name="state">
                  {(field) => (
                    <PreferenceField
                      error={getFieldError(field.state.meta)}
                      htmlFor={field.name}
                      label={t("profile.fields.state")}
                    >
                      <InlineSelect
                        disabled={!country}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={(next) => {
                          field.handleChange(next)
                          form.setFieldValue("city", "")
                        }}
                        options={stateOptions}
                        placeholder={
                          country
                            ? t("profile.placeholders.select_state")
                            : t("profile.placeholders.select_country_first")
                        }
                        value={field.state.value}
                      />
                    </PreferenceField>
                  )}
                </form.Field>

                <form.Field name="city">
                  {(field) => (
                    <PreferenceField
                      error={getFieldError(field.state.meta)}
                      htmlFor={field.name}
                      label={t("profile.fields.city")}
                    >
                      <InlineSelect
                        disabled={!stateName}
                        id={field.name}
                        name={field.name}
                        onBlur={field.handleBlur}
                        onChange={field.handleChange}
                        options={cityOptions}
                        placeholder={
                          stateName
                            ? t("profile.placeholders.select_city")
                            : t("profile.placeholders.select_state_first")
                        }
                        value={field.state.value}
                      />
                    </PreferenceField>
                  )}
                </form.Field>
              </PreferencesGroup>
            )
          }}
        </form.Subscribe>

        <PreferencesGroup
          subtitle={t("profile.sections.learning_subtitle")}
          title={t("profile.sections.learning")}
        >
          <form.Field name="duration">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.duration")}
              >
                <InlineSelect
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  options={durationOptions.map((o) => ({
                    label: `${o.value} ${t("common.minutes")}`,
                    value: String(o.value),
                  }))}
                  placeholder={t("profile.placeholders.daily_goal")}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>

          <form.Field name="codingExperience">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.experience")}
              >
                <InlineSelect
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  options={codingExperienceOptions.map((o) => ({
                    label: t(`profile.options.experience.${o.value}`),
                    value: o.value,
                  }))}
                  placeholder={t("profile.placeholders.select_level")}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>

          <form.Field name="goals">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.goals")}
              >
                <InlineSelect
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  options={goalsOptions.map((o) => {
                    const minutes = o.value.replace(/\D/g, "")
                    const levelKey =
                      o.value.replace(/\d+min/, "").toLowerCase() || "casual"
                    return {
                      label: `${minutes} ${t("common.min")} (${t(`profile.options.goals.${levelKey}`)})`,
                      value: o.value,
                    }
                  })}
                  placeholder={t("profile.placeholders.select_goal")}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>

          <form.Field name="background">
            {(field) => (
              <PreferenceField
                error={getFieldError(field.state.meta)}
                htmlFor={field.name}
                label={t("profile.fields.background")}
              >
                <InlineSelect
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  options={backgroundOptions.map((o) => ({
                    label: t(`profile.options.background.${o.value}`),
                    value: o.value,
                  }))}
                  placeholder={t("profile.placeholders.select_background")}
                  value={field.state.value}
                />
              </PreferenceField>
            )}
          </form.Field>
        </PreferencesGroup>
      </div>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button
            className="bg-loops-cyan hover:bg-loops-cyan/90 text-loops-light mt-10 h-14 w-full rounded-xl text-lg font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
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

function getFieldError({ errors, isTouched }: FieldErrorProps) {
  if (!isTouched || !errors || errors.length === 0) return null
  return errors.filter((e): e is string => typeof e === "string").join(", ")
}

function sortStrings(values: Array<string>) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function toOptions(values: Array<string>) {
  return values.map((v) => ({ label: v, value: v }))
}
