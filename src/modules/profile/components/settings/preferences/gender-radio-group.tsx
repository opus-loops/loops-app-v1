import { useTranslation } from "react-i18next"
import { genderOptions } from "./constants"

type Gender = (typeof genderOptions)[number]["value"]

type GenderRadioGroupProps = {
  value: string
  onChange: (value: Gender) => void
}

export function GenderRadioGroup({ value, onChange }: GenderRadioGroupProps) {
  const { t } = useTranslation()

  return (
    <div
      role="radiogroup"
      aria-label={t("profile.fields.gender")}
      className="grid grid-cols-2 gap-2"
    >
      {genderOptions.map((option) => {
        const isSelected = option.value === value
        const label =
          option.value === "male"
            ? `👦 ${t("profile.options.gender.male")}`
            : `👧 ${t("profile.options.gender.female")}`

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={[
              "h-11 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2",
              isSelected
                ? "bg-loops-pink text-loops-light shadow-sm shadow-loops-pink/20 focus-visible:ring-loops-pink"
                : "bg-loops-light text-loops-dark hover:bg-loops-light/90 focus-visible:ring-loops-dark/20",
            ].join(" ")}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
