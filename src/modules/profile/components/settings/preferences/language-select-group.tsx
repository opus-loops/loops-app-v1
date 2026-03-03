import { languageOptions } from "./constants"

type Language = (typeof languageOptions)[number]["value"]

type LanguageSelectGroupProps = {
  onChange: (value: Language) => void
  value: Language
}

export function LanguageSelectGroup({
  onChange,
  value,
}: LanguageSelectGroupProps) {
  const selectedIndex = Math.max(
    0,
    languageOptions.findIndex((o) => o.value === value),
  )

  return (
    <div
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
      role="radiogroup"
    >
      {languageOptions.map((option) => {
        const isSelected = option.value === value
        return (
          <button
            aria-checked={isSelected}
            className={[
              "h-11 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:outline-none",
              isSelected
                ? "bg-loops-cyan text-loops-light shadow-loops-cyan/20 focus-visible:ring-loops-cyan shadow-sm"
                : "bg-loops-light text-loops-dark hover:bg-loops-light/90 focus-visible:ring-loops-dark/20",
            ].join(" ")}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            tabIndex={isSelected ? 0 : -1}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
