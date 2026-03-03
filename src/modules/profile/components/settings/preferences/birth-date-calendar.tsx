import { format, parseISO } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { useMemo, useState } from "react"

import { Calendar } from "@/modules/shared/components/ui/calendar"

type BirthDateCalendarProps = {
  onBlur: () => void
  onChange: (value: string) => void
  value: string
}

export function BirthDateCalendar({
  onBlur,
  onChange,
  value,
}: BirthDateCalendarProps) {
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
        aria-expanded={isOpen}
        className="bg-loops-light text-loops-dark hover:bg-loops-light/90 focus-visible:ring-loops-cyan/60 flex h-12 w-full items-center justify-between rounded-xl border border-transparent px-3 text-left text-sm font-semibold shadow-sm backdrop-blur-md transition focus-visible:ring-2 focus-visible:outline-none"
        onBlur={onBlur}
        onClick={() => setIsOpen((v) => !v)}
        type="button"
      >
        <span className={value ? "text-loops-dark" : "text-loops-dark/60"}>
          {selectedDate ? format(selectedDate, "PPP") : "Select birth date"}
        </span>
        <CalendarIcon className="text-loops-cyan h-4 w-4" />
      </button>

      {isOpen ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-md">
          <Calendar
            captionLayout="dropdown"
            className="text-loops-light bg-transparent"
            mode="single"
            onSelect={(date) => {
              if (!date) {
                onChange("")
                return
              }
              onChange(format(date, "yyyy-MM-dd"))
              setIsOpen(false)
            }}
            selected={selectedDate}
            toDate={new Date()}
          />
        </div>
      ) : null}
    </div>
  )
}
