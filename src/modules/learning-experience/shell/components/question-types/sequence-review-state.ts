export type SequenceReviewState =
  | "correct"
  | "incorrect"
  | "unanswered-correct"

export function getSequenceReviewedOrder({
  idealOrder,
  isValidated,
  liveOrder,
  userAnswer,
}: {
  idealOrder: ReadonlyArray<number> | undefined
  isValidated: boolean
  liveOrder: ReadonlyArray<number> | undefined
  userAnswer: ReadonlyArray<number> | undefined
}) {
  if (!isValidated) return [...(liveOrder ?? [])]
  if (userAnswer && userAnswer.length > 0) return [...userAnswer]

  return [...(idealOrder ?? [])]
}

export function getSequenceReviewState({
  idealOrder,
  itemIndex,
  position,
  userAnswer,
}: {
  idealOrder: ReadonlyArray<number> | undefined
  itemIndex: number
  position: number
  userAnswer: ReadonlyArray<number> | undefined
}): SequenceReviewState {
  if ((userAnswer?.length ?? 0) === 0) return "unanswered-correct"

  return idealOrder?.[position] === itemIndex ? "correct" : "incorrect"
}
