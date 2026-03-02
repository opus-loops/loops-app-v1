import countriesCitiesData from "virtual:countries-cities"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  backgroundOptions,
  codingExperienceOptions,
  durationOptions,
  goalsOptions,
} from "./constants"
import { BirthDateCalendar } from "./birth-date-calendar"
import { GenderRadioGroup } from "./gender-radio-group"
import { InlineSelect } from "./inline-select"
import { LanguageSelectGroup } from "./language-select-group"
import { PreferenceField } from "./preference-field"
import { PreferencesGroup } from "./preferences-group"

type FieldErrorProps = {
  isTouched: boolean
  errors: string[]
}

function getFieldError({ isTouched, errors }: FieldErrorProps) {
  if (!isTouched || errors.length === 0) return null
  return errors.join(", ")
}

type CountriesCities = {
  Countries: Array<{
    CountryName: string
    States: Array<{
      StateName: string
      Cities: string[]
    }>
  }>
}

function toOptions(values: string[]) {
  return values.map((v) => ({ value: v, label: v }))
}

function sortStrings(values: string[]) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

type PreferencesFieldsProps = {
  form: any
}

export function PreferencesFields({ form }: PreferencesFieldsProps) {
  const { t } = useTranslation()
  const dataset = countriesCitiesData as CountriesCities

  const countryOptions = useMemo(() => {
    const countries = dataset?.Countries ?? []
    return toOptions(sortStrings(countries.map((c) => c.CountryName)))
  }, [dataset])

  return (
    <div className="flex flex-col gap-6">
      <PreferencesGroup
        title={t("profile.sections.personal")}
        subtitle={t("profile.sections.personal_subtitle")}
      >
        <form.Field name="birthDate">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.birth_date")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
              variant="plain"
            >
              <BirthDateCalendar
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="gender">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.gender")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
              variant="plain"
            >
              <GenderRadioGroup
                value={field.state.value}
                onChange={field.handleChange}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="language">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.language")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
              variant="plain"
            >
              <LanguageSelectGroup
                value={field.state.value}
                onChange={field.handleChange}
              />
            </PreferenceField>
          )}
        </form.Field>
      </PreferencesGroup>

      <form.Subscribe selector={(state: any) => [state.values.country, state.values.state]}>
        {([country, stateName]: [string, string]) => {
          const selectedCountry = (dataset?.Countries ?? []).find(
            (c) => c.CountryName === country,
          )
          const stateOptions = toOptions(
            sortStrings((selectedCountry?.States ?? []).map((s) => s.StateName)),
          )
          const selectedState = (selectedCountry?.States ?? []).find(
            (s) => s.StateName === stateName,
          )
          const cityOptions = toOptions(sortStrings(selectedState?.Cities ?? []))

          return (
            <PreferencesGroup
              title={t("profile.sections.location")}
              subtitle={t("profile.sections.location_subtitle")}
            >
              <form.Field name="country">
                {(field: any) => (
                  <PreferenceField
                    label={t("profile.fields.country")}
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={t("profile.placeholders.select_country")}
                      options={countryOptions}
                      onBlur={field.handleBlur}
                      onChange={(next) => {
                        field.handleChange(next)
                        form.setFieldValue("state", "")
                        form.setFieldValue("city", "")
                      }}
                    />
                  </PreferenceField>
                )}
              </form.Field>

              <form.Field name="state">
                {(field: any) => (
                  <PreferenceField
                    label={t("profile.fields.state")}
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={
                        country
                          ? t("profile.placeholders.select_state")
                          : t("profile.placeholders.select_country_first")
                      }
                      options={stateOptions}
                      disabled={!country}
                      onBlur={field.handleBlur}
                      onChange={(next) => {
                        field.handleChange(next)
                        form.setFieldValue("city", "")
                      }}
                    />
                  </PreferenceField>
                )}
              </form.Field>

              <form.Field name="city">
                {(field: any) => (
                  <PreferenceField
                    label={t("profile.fields.city")}
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={
                        stateName
                          ? t("profile.placeholders.select_city")
                          : t("profile.placeholders.select_state_first")
                      }
                      options={cityOptions}
                      disabled={!stateName}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                    />
                  </PreferenceField>
                )}
              </form.Field>
            </PreferencesGroup>
          )
        }}
      </form.Subscribe>

      <PreferencesGroup
        title={t("profile.sections.learning")}
        subtitle={t("profile.sections.learning_subtitle")}
      >
        <form.Field name="duration">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.duration")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={t("profile.placeholders.daily_goal")}
                options={durationOptions.map((o) => ({
                  value: String(o.value),
                  label: `${o.value} ${t("common.minutes")}`,
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="codingExperience">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.experience")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={t("profile.placeholders.select_level")}
                options={codingExperienceOptions.map((o) => ({
                  value: o.value,
                  label: t(`profile.options.experience.${o.value}`),
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="goals">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.goals")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={t("profile.placeholders.select_goal")}
                options={goalsOptions.map((o) => {
                  const minutes = o.value.replace(/\D/g, "")
                  const levelKey = o.value.replace(/\d+min/, "").toLowerCase() || "casual"
                  return {
                    value: o.value,
                    label: `${minutes} ${t("common.min")} (${t(`profile.options.goals.${levelKey}`)})`,
                  }
                })}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="background">
          {(field: any) => (
            <PreferenceField
              label={t("profile.fields.background")}
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={t("profile.placeholders.select_background")}
                options={backgroundOptions.map((o) => ({
                  value: o.value,
                  label: t(`profile.options.background.${o.value}`),
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>
      </PreferencesGroup>
    </div>
  )
}
