import { ChevronDown } from "lucide-react"

type InlineSelectOption = {
  value: string
  label: string
}

type InlineSelectProps = {
  id: string
  name: string
  value: string
  options: InlineSelectOption[]
  placeholder?: string
  disabled?: boolean
  onChange: (value: string) => void
  onBlur: () => void
}

export function InlineSelect({
  id,
  name,
  value,
  options,
  placeholder,
  disabled = false,
  onChange,
  onBlur,
}: InlineSelectProps) {
  return (
    <div className="relative flex items-center">
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className="h-10 w-full cursor-pointer appearance-none truncate bg-transparent pr-7 text-sm font-medium text-loops-dark outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placeholder ? (
          <option value="" disabled className="bg-loops-light text-loops-dark">
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option
            key={o.value}
            value={o.value}
            className="bg-loops-light text-loops-dark"
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-loops-dark/60" />
    </div>
  )
}
