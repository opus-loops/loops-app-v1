import { languageOptions } from "./constants"

type Language = (typeof languageOptions)[number]["value"]

type LanguageSelectGroupProps = {
  value: Language
  onChange: (value: Language) => void
}

export function LanguageSelectGroup({ value, onChange }: LanguageSelectGroupProps) {
  const selectedIndex = Math.max(
    0,
    languageOptions.findIndex((o) => o.value === value),
  )

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="grid grid-cols-3 gap-2"
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return
        e.preventDefault()
        const delta = e.key === "ArrowRight" ? 1 : -1
        const nextIndex =
          (selectedIndex + delta + languageOptions.length) %
          languageOptions.length
        onChange(languageOptions[nextIndex].value)
      }}
    >
      {languageOptions.map((option) => {
        const isSelected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={[
              "h-11 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
              isSelected
                ? "bg-loops-cyan text-loops-light shadow-sm shadow-loops-cyan/20 focus-visible:ring-loops-cyan"
                : "bg-loops-light text-loops-dark hover:bg-loops-light/90 focus-visible:ring-loops-dark/20",
            ].join(" ")}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
