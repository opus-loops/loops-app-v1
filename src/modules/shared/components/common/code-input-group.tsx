import React, { useCallback, useRef, useState } from "react"

import { DigitInput } from "./digit-input"

type CodeInputGroupProps = {
  length?: number
  onChange: (value: string) => void
}

export function CodeInputGroup({ length = 5, onChange }: CodeInputGroupProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const [digits, setDigits] = useState<Array<string>>(Array(length).fill(""))

  const updateDigitsAndNotifyParent = useCallback(
    (newDigits: Array<string>) => {
      setDigits(newDigits)
      const newValue = newDigits.join("")
      onChange(newValue)
    },
    [onChange],
  )

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length && inputRefs.current[index]) {
        inputRefs.current[index]?.focus()
      }
    },
    [length],
  )

  const handleDigitChange = useCallback(
    (index: number, digit: string) => {
      const newDigits = [...digits]
      newDigits[index] = digit
      updateDigitsAndNotifyParent(newDigits)

      if (digit && index < length - 1) focusInput(index + 1)
    },
    [digits, length, focusInput, updateDigitsAndNotifyParent],
  )

  const handleKeyDown = useCallback(
    (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        const newDigits = [...digits]

        if (digits[index]) {
          // Clear current input
          newDigits[index] = ""
          updateDigitsAndNotifyParent(newDigits)
        } else if (index > 0) {
          // Focus previous input and clear it
          newDigits[index - 1] = ""
          updateDigitsAndNotifyParent(newDigits)
          focusInput(index - 1)
        }
      } else if (event.key === "ArrowLeft" && index > 0) {
        focusInput(index - 1)
      } else if (event.key === "ArrowRight" && index < length - 1) {
        focusInput(index + 1)
      } else if (event.key === "v" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault()
        navigator.clipboard
          .readText()
          .then((pastedData) => {
            const pastedDigits = pastedData.replace(/\D/g, "").slice(0, length)

            if (pastedDigits.length > 0) {
              const newDigits = Array(length).fill("")
              for (let i = 0; i < pastedDigits.length && i < length; i++) {
                newDigits[i] = pastedDigits[i]
              }
              updateDigitsAndNotifyParent(newDigits)

              // Focus the next empty input or the last input
              const nextEmptyIndex = Math.min(pastedDigits.length, length - 1)
              focusInput(nextEmptyIndex)
            }
          })
          .catch(() => {
            // Fallback: do nothing if clipboard access fails
          })
      }
    },
    [digits, length, focusInput, updateDigitsAndNotifyParent],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData("text/plain")
      const pastedDigits = pastedData.replace(/\D/g, "").slice(0, length)

      if (pastedDigits.length > 0) {
        const newDigits = Array(length).fill("")
        for (let i = 0; i < pastedDigits.length && i < length; i++) {
          newDigits[i] = pastedDigits[i]
        }
        updateDigitsAndNotifyParent(newDigits)

        // Focus the next empty input or the last input
        const nextEmptyIndex = Math.min(pastedDigits.length, length - 1)
        focusInput(nextEmptyIndex)
      }
    },
    [length, focusInput, updateDigitsAndNotifyParent],
  )

  return (
    <div className="flex items-center justify-center gap-3" dir="ltr">
      {digits.map((digit, index) => (
        <DigitInput
          autoFocus={index === 0}
          key={index}
          onChange={(value) => handleDigitChange(index, value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          value={digit}
        />
      ))}
    </div>
  )
}

CodeInputGroup.displayName = "CodeInputGroup"
