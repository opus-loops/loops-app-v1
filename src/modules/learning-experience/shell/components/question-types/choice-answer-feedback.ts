export type ChoiceAnswerFeedbackVariant = "correct" | "incomplete" | "incorrect"

export function getChoiceAnswerFeedbackVariant({
  idealOptions,
  userAnswer,
}: {
  idealOptions: ReadonlyArray<number> | undefined
  userAnswer: ReadonlyArray<number> | undefined
}): ChoiceAnswerFeedbackVariant {
  if (!idealOptions || !userAnswer || userAnswer.length === 0)
    return "incorrect"

  const hasWrongSelection = userAnswer.some(
    (selectedOption) => !idealOptions.includes(selectedOption),
  )
  if (hasWrongSelection) return "incorrect"

  if (idealOptions.length !== userAnswer.length) return "incomplete"

  const selectedOptions = new Set(userAnswer)
  const hasAllExpectedOptions = idealOptions.every((idealOption) =>
    selectedOptions.has(idealOption),
  )

  return hasAllExpectedOptions ? "correct" : "incomplete"
}
