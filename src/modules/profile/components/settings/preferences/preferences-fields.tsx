import countriesCitiesData from "virtual:countries-cities"
import { useMemo } from "react"
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
  const dataset = countriesCitiesData as CountriesCities

  const countryOptions = useMemo(() => {
    const countries = dataset?.Countries ?? []
    return toOptions(sortStrings(countries.map((c) => c.CountryName)))
  }, [dataset])

  return (
    <div className="flex flex-col gap-6">
      <PreferencesGroup
        title="Personal"
        subtitle="A few details to personalize your experience."
      >
        <form.Field name="birthDate">
          {(field: any) => (
            <PreferenceField
              label="Birth date"
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
              label="Gender"
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
              label="Language"
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
              title="Location"
              subtitle="Used for local content, stats, and matching."
            >
              <form.Field name="country">
                {(field: any) => (
                  <PreferenceField
                    label="Country"
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder="Select a country"
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
                    label="State"
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={country ? "Select a state" : "Select country first"}
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
                    label="City"
                    htmlFor={field.name}
                    error={getFieldError(field.state.meta)}
                  >
                    <InlineSelect
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      placeholder={stateName ? "Select a city" : "Select state first"}
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
        title="Learning"
        subtitle="Tune your pace and experience level."
      >
        <form.Field name="duration">
          {(field: any) => (
            <PreferenceField
              label="Learning duration"
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Pick a daily goal"
                options={durationOptions.map((o) => ({
                  value: String(o.value),
                  label: o.label,
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="codingExperience">
          {(field: any) => (
            <PreferenceField
              label="Coding experience"
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Select your level"
                options={codingExperienceOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="goals">
          {(field: any) => (
            <PreferenceField
              label="Goals"
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Select your goal"
                options={goalsOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>

        <form.Field name="background">
          {(field: any) => (
            <PreferenceField
              label="Background"
              htmlFor={field.name}
              error={getFieldError(field.state.meta)}
            >
              <InlineSelect
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Select your background"
                options={backgroundOptions.map((o) => ({
                  value: o.value,
                  label: o.label,
                }))}
              />
            </PreferenceField>
          )}
        </form.Field>
      </PreferencesGroup>
    </div>
  )
}
