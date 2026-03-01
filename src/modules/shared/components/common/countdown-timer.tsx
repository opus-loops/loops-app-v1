import { cn } from "@/modules/shared/lib/utils"
import { useEffect, useState } from "react"

type CountdownTimerProps = {
  initialSeconds?: number
  isActive?: boolean
  onExpire?: () => void
}

export function CountdownTimer({
  initialSeconds = 60,
  isActive = true,
  onExpire,
}: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    if (!isActive || isExpired) return

    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 1) {
          setIsExpired(true)
          onExpire?.()
          return 0
        }
        return prevSeconds - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, isExpired, onExpire])

  useEffect(() => {
    setSeconds(initialSeconds)
    setIsExpired(false)
  }, [initialSeconds])

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0")

    const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0")
    return `${minutes}:${remainingSeconds}`
  }

  return (
    <div className="flex items-center gap-1">
      <span className="font-outfit text-loops-light text-sm font-medium">
        Expires in
      </span>
      <span
        className={cn(
          "font-outfit text-sm font-medium transition-colors duration-300",
          isExpired ? "text-red-400" : "text-loops-cyan",
          "tabular-nums",
        )}
      >
        {formatTime(seconds)}
      </span>
    </div>
  )
}

CountdownTimer.displayName = "CountdownTimer"
