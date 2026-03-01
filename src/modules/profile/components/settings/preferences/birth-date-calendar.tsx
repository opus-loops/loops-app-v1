import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/modules/shared/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { useMemo, useState } from "react"

type BirthDateCalendarProps = {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}

export function BirthDateCalendar({ value, onChange, onBlur }: BirthDateCalendarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedDate = useMemo(() => {
    if (!value) return undefined
    try {
      return parseISO(value)
    } catch {
      return undefined
    }
  }, [value])

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onBlur={onBlur}
        className="flex h-12 w-full items-center justify-between rounded-xl border border-transparent bg-loops-light px-3 text-left text-sm font-semibold text-loops-dark shadow-sm backdrop-blur-md transition hover:bg-loops-light/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-loops-cyan/60"
        aria-expanded={isOpen}
      >
        <span className={value ? "text-loops-dark" : "text-loops-dark/60"}>
          {selectedDate ? format(selectedDate, "PPP") : "Select birth date"}
        </span>
        <CalendarIcon className="h-4 w-4 text-loops-cyan" />
      </button>

      {isOpen ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) {
                onChange("")
                return
              }
              onChange(format(date, "yyyy-MM-dd"))
              setIsOpen(false)
            }}
            toDate={new Date()}
            captionLayout="dropdown"
            className="bg-transparent text-loops-light"
          />
        </div>
      ) : null}
    </div>
  )
}
