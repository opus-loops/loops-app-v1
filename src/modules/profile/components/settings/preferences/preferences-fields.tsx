import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import countriesCitiesData from "../../../../../../assets/countries-cities.json"
import { BirthDateCalendar } from "./birth-date-calendar"
import {
  backgroundOptions,
  codingExperienceOptions,
  durationOptions,
  goalsOptions,
} from "./constants"
import { GenderRadioGroup } from "./gender-radio-group"
import { InlineSelect } from "./inline-select"
import { LanguageSelectGroup } from "./language-select-group"
import { PreferenceField } from "./preference-field"
import { PreferencesGroup } from "./preferences-group"

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
  errors: Array<string>
  isTouched: boolean
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
        subtitle={t("profile.sections.personal_subtitle")}
        title={t("profile.sections.personal")}
      >
        <form.Field name="birthDate">
          {(field: any) => (
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
          {(field: any) => (
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
          {(field: any) => (
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
        selector={(state: any) => [state.values.country, state.values.state]}
      >
        {([country, stateName]: [string, string]) => {
          const selectedCountry = (dataset?.Countries ?? []).find(
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
                {(field: any) => (
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
                {(field: any) => (
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
                {(field: any) => (
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
          {(field: any) => (
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
          {(field: any) => (
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
          {(field: any) => (
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
          {(field: any) => (
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
  )
}

function getFieldError({ errors, isTouched }: FieldErrorProps) {
  if (!isTouched || errors.length === 0) return null
  return errors.join(", ")
}

function sortStrings(values: Array<string>) {
  return [...values].sort((a, b) => a.localeCompare(b))
}

function toOptions(values: Array<string>) {
  return values.map((v) => ({ label: v, value: v }))
}
