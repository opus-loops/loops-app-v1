export type QuizTimerUrgency = "default" | "green" | "orange" | "red" | "yellow"

type QuizTimerPresentationStateArgs = {
  estimatedTime: number
  isTimerRunning: boolean
  shouldReduceMotion: boolean
  timeLeft: number
}

export function getQuizTimerPresentationState({
  estimatedTime,
  isTimerRunning,
  shouldReduceMotion,
  timeLeft,
}: QuizTimerPresentationStateArgs) {
  if (estimatedTime <= 0) {
    return {
      isPulseActive: false,
      pulseStep: null,
      urgency: "default" as const,
    }
  }

  const safeTimeLeft = Math.max(0, timeLeft)
  const yellowThreshold = Math.max(7, Math.ceil(estimatedTime * 0.5))
  const orangeThreshold = Math.max(6, Math.ceil(estimatedTime * 0.25))

  let urgency: QuizTimerUrgency = "green"

  if (safeTimeLeft <= 5) urgency = "red"
  else if (safeTimeLeft <= orangeThreshold) urgency = "orange"
  else if (safeTimeLeft <= yellowThreshold) urgency = "yellow"

  const isPulseActive =
    isTimerRunning &&
    !shouldReduceMotion &&
    safeTimeLeft > 0 &&
    safeTimeLeft <= 5

  return {
    isPulseActive,
    pulseStep: isPulseActive ? safeTimeLeft : null,
    urgency,
  }
}
