import { useTranslation } from "react-i18next"

import { genderOptions } from "./constants"

type Gender = (typeof genderOptions)[number]["value"]

type GenderRadioGroupProps = {
  onChange: (value: Gender) => void
  value: string
}

export function GenderRadioGroup({ onChange, value }: GenderRadioGroupProps) {
  const { t } = useTranslation()

  return (
    <div
      aria-label={t("profile.fields.gender")}
      className="grid grid-cols-2 gap-2"
      role="radiogroup"
    >
      {genderOptions.map((option) => {
        const isSelected = option.value === value
        const label =
          option.value === "male"
            ? `👦 ${t("profile.options.gender.male")}`
            : `👧 ${t("profile.options.gender.female")}`

        return (
          <button
            aria-checked={isSelected}
            className={[
              "h-11 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:outline-none",
              isSelected
                ? "bg-loops-pink text-loops-light shadow-loops-pink/20 focus-visible:ring-loops-pink shadow-sm"
                : "bg-loops-light text-loops-dark hover:bg-loops-light/90 focus-visible:ring-loops-dark/20",
            ].join(" ")}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
