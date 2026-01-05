import { cn } from "@/modules/shared/lib/utils"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { useState } from "react"

type SequenceOrderComponentProps = {
  subQuiz: EnhancedSubQuiz & { questionType: "sequence_order" }
}

// Helper function to safely parse userAnswer JSON string
const parseUserAnswer = (userAnswer: string | undefined): number[] => {
  if (!userAnswer) return []
  try {
    const parsed = JSON.parse(userAnswer)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function SequenceOrderComponent({
  subQuiz,
}: SequenceOrderComponentProps) {
  const [userOrder, setUserOrder] = useState<number[]>([])

  const question = subQuiz.content
  const completedQuestion = subQuiz.completedSequenceOrder

  if (!question) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-loops-light">Question content not available</p>
      </div>
    )
  }

  // Get the question text in the default language
  const questionText =
    question.headline.find((h) => h.language === question.defaultLanguage)
      ?.content ||
    question.headline[0]?.content ||
    ""

  const handleItemClick = (index: number) => {
    if (isValidated) return

    if (userOrder.includes(index)) {
      // Remove from order
      setUserOrder(userOrder.filter((i) => i !== index))
    } else {
      // Add to order
      setUserOrder([...userOrder, index])
    }
  }

  const getItemStyle = (index: number) => {
    const orderPosition = userOrder.indexOf(index)
    const isSelected = orderPosition !== -1

    if (!isValidated) {
      // Non-validated state
      return cn(
        "flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all min-h-[60px]",
        "bg-slate-800 border-slate-600 text-white hover:border-slate-500",
        isSelected && "border-cyan-400 bg-slate-700",
      )
    } else {
      // Validated state - show correct/incorrect
      const correctPosition = question.idealOrder.indexOf(index)
      const userPosition = completedQuestion?.userAnswer?.indexOf(index) ?? -1
      const isCorrectPosition =
        correctPosition === userPosition && userPosition !== -1

      if (isCorrectPosition) {
        return cn(
          "flex items-center justify-center p-4 rounded-lg border-2 min-h-[60px]",
          "bg-green-900/30 border-green-500 text-white",
        )
      } else if (userPosition !== -1) {
        return cn(
          "flex items-center justify-center p-4 rounded-lg border-2 min-h-[60px]",
          "bg-red-900/30 border-red-500 text-white",
        )
      } else {
        return cn(
          "flex items-center justify-center p-4 rounded-lg border-2 min-h-[60px]",
          "bg-slate-800 border-slate-600 text-white opacity-60",
        )
      }
    }
  }

  const getItemContent = (index: number) => {
    const choice = question.sequence[index]
    const choiceText =
      choice.find((c) => c.language === question.defaultLanguage)?.content ||
      choice[0]?.content ||
      ""

    const orderPosition = userOrder.indexOf(index)
    const isSelected = orderPosition !== -1

    if (!isValidated) {
      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-base">
            {String.fromCharCode(65 + index)}) {choiceText}
          </span>
          {isSelected && (
            <span className="rounded-full bg-cyan-400 px-2 py-1 text-sm font-medium text-white">
              {orderPosition + 1}
            </span>
          )}
        </div>
      )
    } else {
      const userPosition = completedQuestion?.userAnswer?.indexOf(index) ?? -1
      const correctPosition = question.idealOrder.indexOf(index)

      return (
        <div className="flex w-full items-center justify-between">
          <span className="text-base">
            {String.fromCharCode(65 + index)}) {choiceText}
          </span>
          <div className="flex items-center gap-2">
            {userPosition !== -1 && (
              <span className="rounded-full bg-slate-600 px-2 py-1 text-sm text-white">
                Your: {userPosition + 1}
              </span>
            )}
            <span className="rounded-full bg-green-600 px-2 py-1 text-sm text-white">
              Correct: {correctPosition + 1}
            </span>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl leading-relaxed font-medium text-white">
          {questionText}
        </h2>
      </div>

      {/* Instructions */}
      {!isValidated && (
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            Click on the items in the correct order. Click again to remove from
            sequence.
          </p>
        </div>
      )}

      {/* Items */}
      <div className="space-y-4">
        {question.sequence.map((_, index) => (
          <div
            key={index}
            className={getItemStyle(index)}
            onClick={() => handleItemClick(index)}
          >
            {getItemContent(index)}
          </div>
        ))}
      </div>

      {/* Current Order Display */}
      {!isValidated && userOrder.length > 0 && (
        <div className="mt-6 rounded-lg bg-slate-800 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-300">
            Current Order:
          </h3>
          <div className="flex flex-wrap gap-2">
            {userOrder.map((itemIndex, position) => {
              const choice = question.sequence[itemIndex]
              const choiceText =
                choice.find((c) => c.language === question.defaultLanguage)
                  ?.content ||
                choice[0]?.content ||
                ""
              return (
                <span
                  key={itemIndex}
                  className="rounded-full bg-cyan-400 px-3 py-1 text-sm text-white"
                >
                  {position + 1}. {String.fromCharCode(65 + itemIndex)}){" "}
                  {choiceText}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
