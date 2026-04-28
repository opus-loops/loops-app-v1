export type ChoiceReviewState =
  | "missed-correct-no-wrong"
  | "missed-correct-with-wrong"
  | "neutral"
  | "selected-correct"
  | "selected-incorrect"
  | "unanswered-correct"

export function getChoiceReviewState({
  idealOptions,
  index,
  userAnswer,
}: {
  idealOptions: ReadonlyArray<number> | undefined
  index: number
  userAnswer: ReadonlyArray<number> | undefined
}): ChoiceReviewState {
  const expectedOptions = idealOptions ?? []
  const selectedOptions = userAnswer ?? []
  const hasSelection = selectedOptions.length > 0

  const isCorrect = expectedOptions.includes(index)
  const wasSelected = selectedOptions.includes(index)
  const hasWrongSelection = selectedOptions.some(
    (selectedOption) => !expectedOptions.includes(selectedOption),
  )

  if (wasSelected && isCorrect) return "selected-correct"
  if (wasSelected) return "selected-incorrect"
  if (!isCorrect) return "neutral"
  if (!hasSelection) return "unanswered-correct"

  return hasWrongSelection
    ? "missed-correct-with-wrong"
    : "missed-correct-no-wrong"
}
