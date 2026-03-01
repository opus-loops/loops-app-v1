import { cn } from "@/modules/shared/lib/utils"
import type { ChangeEvent, KeyboardEvent } from "react"
import React, { forwardRef } from "react"

interface DigitInputProps {
  autoFocus?: boolean
  onChange: (value: string) => void
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void
  onPaste?: (e: React.ClipboardEvent<HTMLInputElement>) => void
  value: string
}

export const DigitInput = forwardRef<HTMLInputElement, DigitInputProps>(
  ({ autoFocus, onChange, onKeyDown, onPaste, value }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (inputValue === "" || /^[0-9]$/.test(inputValue)) onChange(inputValue)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (["Backspace", "Delete", "Enter", "Escape", "Tab"].includes(e.key))
        return onKeyDown?.(e)

      if (["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"].includes(e.key))
        return

      if (!/^[0-9]$/.test(e.key)) e.preventDefault()
      onKeyDown?.(e)
    }

    return (
      <input
        autoFocus={autoFocus}
        className={cn(
          "h-14 w-14 text-center text-lg font-semibold",
          "bg-loops-light rounded-2xl border-0 text-gray-900",
          "focus:ring-loops-cyan focus:ring-2 focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "placeholder:text-gray-400",
        )}
        inputMode="numeric"
        maxLength={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={onPaste}
        pattern="[0-9]*"
        ref={ref}
        type="text"
        value={value}
      />
    )
  },
)

DigitInput.displayName = "DigitInput"
