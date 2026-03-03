import { ChevronDown } from "lucide-react"

type InlineSelectOption = {
  label: string
  value: string
}

type InlineSelectProps = {
  disabled?: boolean
  id: string
  name: string
  onBlur: () => void
  onChange: (value: string) => void
  options: Array<InlineSelectOption>
  placeholder?: string
  value: string
}

export function InlineSelect({
  disabled = false,
  id,
  name,
  onBlur,
  onChange,
  options,
  placeholder,
  value,
}: InlineSelectProps) {
  return (
    <div className="relative flex items-center">
      <select
        className="text-loops-dark h-10 w-full cursor-pointer appearance-none truncate bg-transparent pr-7 text-sm font-medium outline-none disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        id={id}
        name={name}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        value={value}
      >
        {placeholder ? (
          <option className="bg-loops-light text-loops-dark" disabled value="">
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option
            className="bg-loops-light text-loops-dark"
            key={o.value}
            value={o.value}
          >
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="text-loops-dark/60 pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2" />
    </div>
  )
}
