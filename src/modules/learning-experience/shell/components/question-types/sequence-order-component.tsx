import { Reorder } from "framer-motion"
import { CheckCircle2, GripVertical, XCircle } from "lucide-react"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import { useTranslation } from "react-i18next"

import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"

import { QuestionValidationPopup } from "@/modules/learning-experience/shell/components/question-types/question-validation-popup"
import {
  getSequenceReviewedOrder,
  getSequenceReviewState,
} from "@/modules/learning-experience/shell/components/question-types/sequence-review-state"
import { cn } from "@/modules/shared/lib/utils"
import { useValidateSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-validate-sequence-order"

export type SubQuizRef = {
  skip: (isTimeUp?: boolean) => void
  validate: (timeLeft: number) => Promise<void>
}

type SequenceOrderComponentProps = {
  categoryId: string
  onStopTimer: () => void
  subQuiz: { questionType: "sequenceOrders" } & EnhancedSubQuiz
}

export const SequenceOrderComponent = forwardRef<
  SubQuizRef,
  SequenceOrderComponentProps
>(({ categoryId, onStopTimer, subQuiz }, ref) => {
  const { t } = useTranslation()
  const { handleValidateSequenceOrder } = useValidateSequenceOrder()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isTimeUpSkip, setIsTimeUpSkip] = useState(false)
  const pendingValidationQuestionIdRef = useRef<null | string>(null)

  const completedQuestion = subQuiz.completedQuestion

  const isValidated = completedQuestion?.status === "completed"

  const [userOrder, setUserOrder] = useState(
    subQuiz.content?.sequence.map((_, index) => index) || [],
  )

  useEffect(() => {
    setIsPopupOpen(false)
    setIsTimeUpSkip(false)
    setUserOrder(subQuiz.content?.sequence.map((_, index) => index) || [])
    pendingValidationQuestionIdRef.current = null
  }, [subQuiz.questionId])

  useEffect(() => {
    if (!isValidated) return
    // Only show popup if this specific question was just validated in this session
    if (pendingValidationQuestionIdRef.current !== subQuiz.questionId) return
    setIsPopupOpen(true)
    pendingValidationQuestionIdRef.current = null
  }, [isValidated, subQuiz.questionId])

  useImperativeHandle(ref, () => ({
    skip: async (isTimeUp = false) => {
      if (isSubmitting || isValidated) return

      setIsSubmitting(true)
      setIsTimeUpSkip(isTimeUp)
      pendingValidationQuestionIdRef.current = subQuiz.questionId

      await handleValidateSequenceOrder({
        categoryId,
        questionId: subQuiz.questionId,
        quizId: subQuiz.quizId,
        spentTime: subQuiz.content?.estimatedTime ?? 0,
        userAnswer: undefined,
      })

      setIsSubmitting(false)
    },
    validate: async (timeLeft: number) => {
      if (isSubmitting || isValidated) return

      onStopTimer()
      setIsSubmitting(true)
      pendingValidationQuestionIdRef.current = subQuiz.questionId

      const estimatedTime = subQuiz.content?.estimatedTime ?? 0
      const spentTime = Math.max(0, estimatedTime - timeLeft)

      await handleValidateSequenceOrder({
        categoryId,
        questionId: subQuiz.questionId,
        quizId: subQuiz.quizId,
        spentTime,
        userAnswer: userOrder,
      })

      setIsSubmitting(false)
    },
  }))

  const idealOrder = subQuiz.content?.idealOrder || []
  const reviewedOrder = getSequenceReviewedOrder({
    idealOrder,
    isValidated,
    liveOrder: userOrder,
    userAnswer: completedQuestion?.userAnswer,
  })

  const getItemStyle = (
    sequenceReviewState?: ReturnType<typeof getSequenceReviewState>,
  ) => {
    if (!isValidated)
      return cn(
        "flex items-center gap-3 p-4 rounded-lg border-2 bg-slate-800 border-slate-600 text-loops-light cursor-grab active:cursor-grabbing",
        "hover:border-slate-500 transition-colors duration-300",
      )

    return cn(
      "flex items-center gap-3 p-4 rounded-lg border-2 transition-colors duration-300",
      sequenceReviewState === "correct" &&
        "bg-green-900 border-green-500 text-green-400",
      sequenceReviewState === "incorrect" &&
        "bg-red-900 border-red-500 text-red-400",
      sequenceReviewState === "unanswered-correct" &&
        "bg-slate-800 border-green-500 text-loops-light",
    )
  }

  const popupVariant = isTimeUpSkip
    ? "time-up"
    : (() => {
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
          subtitle={
            popupVariant === "time-up"
              ? t("quiz.time_up_message")
              : popupVariant === "correct"
                ? subQuiz.content.congratulatoryMessage[0].content
                : subQuiz.content.consolidationMessage[0].content
          }
          variant={popupVariant}
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
        className="space-y-3"
        onReorder={!isValidated ? setUserOrder : () => {}}
        values={reviewedOrder}
      >
        {reviewedOrder.map((itemIndex, position) => {
          const sequenceReviewState = isValidated
            ? getSequenceReviewState({
                idealOrder,
                itemIndex,
                position,
                userAnswer: completedQuestion.userAnswer,
              })
            : undefined

          return (
            <Reorder.Item
              className={getItemStyle(sequenceReviewState)}
              dragListener={!isValidated}
              key={itemIndex}
              value={itemIndex}
              whileDrag={{ scale: 1.02, zIndex: 10 }}
            >
              {!isValidated && (
                <GripVertical className="h-5 w-5 text-slate-400" />
              )}
              {sequenceReviewState === "correct" && (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
              {sequenceReviewState === "incorrect" && (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  !isValidated
                    ? "bg-slate-700 text-slate-300"
                    : sequenceReviewState === "correct"
                      ? "text-loops-light bg-green-500"
                      : sequenceReviewState === "incorrect"
                        ? "text-loops-light bg-red-500"
                        : "bg-slate-700 text-slate-300",
                )}
              >
                {String.fromCharCode(65 + itemIndex)}
              </span>
              {subQuiz.content && (
                <span className="text-base font-medium">
                  {subQuiz.content.sequence[itemIndex][0].content}
                </span>
              )}
              {sequenceReviewState === "incorrect" && (
                <div className="ml-auto text-xs font-semibold text-red-400 opacity-80">
                  {t("quiz.validation.should_be")}{" "}
                  {subQuiz.content?.sequence[idealOrder[position]][0].content}
                </div>
              )}
            </Reorder.Item>
          )
        })}
      </Reorder.Group>
    </div>
  )
})

SequenceOrderComponent.displayName = "SequenceOrderComponent"
