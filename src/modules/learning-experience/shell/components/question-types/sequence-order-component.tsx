import { QuestionValidationPopup } from "@/modules/learning-experience/shell/components/question-types/question-validation-popup"
import { cn } from "@/modules/shared/lib/utils"
import { useValidateSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-validate-sequence-order"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Reorder } from "framer-motion"
import { GripVertical } from "lucide-react"
import { forwardRef, useEffect, useImperativeHandle, useState } from "react"

export type SubQuizRef = {
  skip: () => void
  validate: (timeLeft: number) => Promise<void>
}

type SequenceOrderComponentProps = {
  subQuiz: EnhancedSubQuiz & { questionType: "sequenceOrders" }
  categoryId: string
  onStopTimer: () => void
}

export const SequenceOrderComponent = forwardRef<
  SubQuizRef,
  SequenceOrderComponentProps
>(({ subQuiz, categoryId, onStopTimer }, ref) => {
  const { handleValidateSequenceOrder } = useValidateSequenceOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  const completedQuestion = subQuiz.completedQuestion

  const isValidated = completedQuestion?.status === "completed"

  const [userOrder, setUserOrder] = useState(
    subQuiz.content?.sequence.map((item, index) => index) || [],
  )

  useEffect(() => {
    setIsPopupOpen(false)
    setUserOrder(subQuiz.content?.sequence.map((_, index) => index) || [])
  }, [subQuiz.questionId])

  useEffect(() => {
    if (!isValidated) return
    setIsPopupOpen(true)
  }, [isValidated])

  useImperativeHandle(ref, () => ({
    skip: async () => {
      if (isSubmitting || isValidated) return

      setIsSubmitting(true)

      await handleValidateSequenceOrder({
        categoryId,
        quizId: subQuiz.quizId,
        questionId: subQuiz.questionId,
        userAnswer: undefined,
        spentTime: subQuiz.content?.estimatedTime ?? 0,
      })

      setIsSubmitting(false)
    },
    validate: async (timeLeft: number) => {
      if (isSubmitting || isValidated) return

      onStopTimer()
      setIsSubmitting(true)

      const estimatedTime = subQuiz.content?.estimatedTime ?? 0
      const spentTime = Math.max(0, estimatedTime - timeLeft)

      await handleValidateSequenceOrder({
        categoryId,
        quizId: subQuiz.quizId,
        questionId: subQuiz.questionId,
        userAnswer: userOrder,
        spentTime,
      })

      setIsSubmitting(false)
    },
  }))

  const getItemStyle = (itemIndex: number) => {
    if (!isValidated) {
      return cn(
        "flex items-center gap-3 p-4 rounded-lg border-2 bg-slate-800 border-slate-600 text-loops-light cursor-grab active:cursor-grabbing",
        "hover:border-slate-500 transition-colors",
      )
    } else {
      const correctPosition = subQuiz.content?.idealOrder?.indexOf(itemIndex)
      const userPosition = userOrder.indexOf(itemIndex)
      const isCorrectPosition = correctPosition === userPosition

      if (isCorrectPosition) {
        return cn(
          "flex items-center gap-3 p-4 rounded-lg border-2",
          "bg-green-900/30 border-green-500 text-loops-light",
        )
      } else {
        return cn(
          "flex items-center gap-3 p-4 rounded-lg border-2",
          "bg-red-900/30 border-red-500 text-loops-light",
        )
      }
    }
  }

  const popupVariant = (() => {
    const idealOrder = subQuiz.content?.idealOrder
    const userAnswer = completedQuestion?.userAnswer
    if (!idealOrder || !userAnswer) return "incorrect"
    if (idealOrder.length !== userAnswer.length) return "incorrect"
    for (let i = 0; i < idealOrder.length; i++) {
      if (idealOrder[i] !== userAnswer[i]) return "incorrect"
    }
    return "correct"
  })()

  return (
    <div className="mx-auto max-w-2xl">
      {subQuiz.content && (
        <QuestionValidationPopup
          isOpen={isPopupOpen}
          onOpenChange={setIsPopupOpen}
          variant={popupVariant}
          subtitle={
            popupVariant === "correct"
              ? subQuiz.content.congratulatoryMessage[0].content
              : subQuiz.content.consolidationMessage[0].content
          }
        />
      )}
      {subQuiz.content && (
        <div className="mb-8">
          <h2 className="text-loops-light text-xl leading-relaxed font-medium">
            {subQuiz.content.headline[0].content}
          </h2>
        </div>
      )}

      <Reorder.Group
        axis="y"
        values={userOrder}
        onReorder={!isValidated ? setUserOrder : () => {}}
        className="space-y-3"
      >
        {userOrder.map((itemIndex) => (
          <Reorder.Item
            key={itemIndex}
            value={itemIndex}
            dragListener={!isValidated}
            className={getItemStyle(itemIndex)}
            whileDrag={{ scale: 1.02, zIndex: 10 }}
          >
            {!isValidated && (
              <GripVertical className="h-5 w-5 text-slate-400" />
            )}
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-700 text-xs font-medium text-slate-300">
              {String.fromCharCode(65 + itemIndex)}
            </span>
            {subQuiz.content && (
              <span className="text-base font-medium">
                {subQuiz.content.sequence[itemIndex][0].content}
              </span>
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  )
})
