import { formatDuration, intervalToDuration } from "date-fns"

/**
 * Formats a duration in seconds to a human-readable string
 * @param seconds - Duration in seconds
 * @returns Formatted string like "1 minute, 52 seconds" or "2 hours, 30 minutes"
 */
export function formatTimeDuration(seconds: number): string {
  if (seconds <= 0) return "0 seconds"

  const duration = intervalToDuration({
    end: seconds * 1000, // Convert to milliseconds
    start: 0,
  })

  return formatDuration(duration, {
    delimiter: ", ",
    format: ["hours", "minutes", "seconds"],
  })
}
