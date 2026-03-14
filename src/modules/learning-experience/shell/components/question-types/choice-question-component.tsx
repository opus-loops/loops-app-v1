import { CheckCircle2, XCircle } from "lucide-react"
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
import { cn } from "@/modules/shared/lib/utils"
import { useValidateChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-validate-choice-question"

export type SubQuizRef = {
  skip: (isTimeUp?: boolean) => void
  validate: (timeLeft: number) => Promise<void>
}

type ChoiceQuestionComponentProps = {
  categoryId: string
  onStopTimer: () => void
  subQuiz: { questionType: "choiceQuestions" } & EnhancedSubQuiz
}

export const ChoiceQuestionComponent = forwardRef<
  SubQuizRef,
  ChoiceQuestionComponentProps
>(({ categoryId, onStopTimer, subQuiz }, ref) => {
  const { t } = useTranslation()
  const { handleValidateChoiceQuestion } = useValidateChoiceQuestion()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedChoices, setSelectedChoices] = useState<Array<number>>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isTimeUpSkip, setIsTimeUpSkip] = useState(false)
  const pendingValidationQuestionIdRef = useRef<null | string>(null)

  const question = subQuiz.content
  const completedQuestion = subQuiz.completedQuestion

  const isValidated = completedQuestion?.status === "completed"

  useEffect(() => {
    setIsPopupOpen(false)
    setIsTimeUpSkip(false)
    setSelectedChoices([])
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
      await handleValidateChoiceQuestion({
        categoryId,
        questionId: subQuiz.questionId,
        quizId: subQuiz.quizId,
        spentTime: question?.estimatedTime ?? 0,
        userAnswer: undefined,
      })
      setIsSubmitting(false)
    },
    validate: async (timeLeft: number) => {
      if (isSubmitting || isValidated || selectedChoices.length === 0) return

      onStopTimer()
      setIsSubmitting(true)
      pendingValidationQuestionIdRef.current = subQuiz.questionId
      const estimatedTime = question?.estimatedTime ?? 0
      const spentTime = Math.max(0, estimatedTime - timeLeft)

      await handleValidateChoiceQuestion({
        categoryId,
        questionId: subQuiz.questionId,
        quizId: subQuiz.quizId,
        spentTime,
        userAnswer: selectedChoices,
      })
      setIsSubmitting(false)
    },
  }))

  if (!question) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-loops-light">Question content not available</p>
      </div>
    )
  }

  // TODO: REFACTOR NEEDED: Get it from api response
  const idealOptions = question.idealOptions
  const userAnswer = completedQuestion?.userAnswer
  const isCorrectAnswer = (() => {
    if (!isValidated) return false
    if (!idealOptions || !userAnswer) return false
    if (idealOptions.length !== userAnswer.length) return false
    const toCounts = (values: ReadonlyArray<number>) => {
      const map = new Map<number, number>()
      for (const v of values) map.set(v, (map.get(v) ?? 0) + 1)
      return map
    }
    const idealCounts = toCounts(idealOptions)
    const userCounts = toCounts(userAnswer)
    if (idealCounts.size !== userCounts.size) return false
    for (const [value, count] of idealCounts)
      if (userCounts.get(value) !== count) return false
    return true
  })()

  const popupVariant = isTimeUpSkip
    ? "time-up"
    : isCorrectAnswer
      ? "correct"
      : "incorrect"

  const handleChoiceSelect = (index: number) => {
    if (isValidated) return

    if (question.isMultiple) {
      setSelectedChoices((prev) => {
        return prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      })
    } else setSelectedChoices([index])
  }

  const getChoiceStyle = (index: number) => {
    if (!isValidated) {
      // Non-validated state
      const isSelected = selectedChoices.includes(index)
      return cn(
        "flex items-center p-4 w-full rounded-lg border-2 cursor-pointer transition-all",
        "bg-slate-800 border-slate-600 text-loops-light hover:border-slate-500",
        isSelected && "border-cyan-400 bg-slate-700",
      )
    } else {
      // Validated state - show correct/incorrect
      const isCorrect = question.idealOptions?.includes(index)
      const wasSelected = completedQuestion.userAnswer?.includes(index) ?? false

      if (isCorrect) {
        return cn(
          "flex items-center p-4 w-full rounded-lg border-2 transition-colors",
          wasSelected
            ? "bg-green-900/40 border-green-500 text-green-400"
            : "bg-yellow-900/20 border-yellow-700 text-yellow-500 opacity-90",
        )
      } else if (wasSelected) {
        return cn(
          "flex items-center p-4 rounded-lg w-full border-2",
          "bg-red-900/40 border-red-500 text-red-400",
        )
      } else {
        return cn(
          "flex items-center p-4 rounded-lg w-full border-2",
          "bg-slate-800 border-slate-700 text-loops-light opacity-50",
        )
      }
    }
  }

  const getChoiceIcon = (index: number) => {
    if (!isValidated) {
      const isSelected = selectedChoices.includes(index)
      return (
        <div
          className={cn(
            "mr-3 flex h-6 w-6 shrink-0 items-center justify-center border-2",
            question.isMultiple ? "rounded-md" : "rounded-full",
            isSelected ? "border-cyan-400 bg-cyan-400" : "border-slate-400",
          )}
        >
          {isSelected &&
            (question.isMultiple ? (
              <svg
                className="text-loops-light h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="bg-loops-light h-2 w-2 rounded-full" />
            ))}
        </div>
      )
    } else {
      const isCorrect = question.idealOptions?.includes(index)
      const wasSelected = completedQuestion.userAnswer?.includes(index) ?? false

      if (isCorrect) {
        return (
          <CheckCircle2
            className={cn(
              "mr-3 h-6 w-6 shrink-0",
              wasSelected ? "text-green-500" : "text-yellow-500",
            )}
          />
        )
      } else if (wasSelected) {
        return <XCircle className="mr-3 h-6 w-6 shrink-0 text-red-500" />
      } else {
        return (
          <div
            className={cn(
              "mr-3 h-6 w-6 shrink-0 border-2 border-slate-600",
              question.isMultiple ? "rounded-md" : "rounded-full",
            )}
          />
        )
      }
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
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

      <div className="mb-8">
        <h2 className="text-loops-light text-xl leading-relaxed font-medium">
          {question.headline[0].content}
        </h2>
      </div>

      <div className="w-full space-y-4">
        {question.choices.map((choice, index) => {
          const choiceText =
            choice.find((c) => c.language === question.defaultLanguage)
              ?.content ||
            choice[0]?.content ||
            ""

          const isCorrect = question.idealOptions?.includes(index)
          const wasSelected =
            completedQuestion?.userAnswer?.includes(index) ?? false
          const isGoodSelection = isCorrect && wasSelected
          const isMissedOption = isCorrect && !wasSelected
          const isBadSelection = !isCorrect && wasSelected

          return (
            <div
              className={getChoiceStyle(index)}
              key={index}
              onClick={() => handleChoiceSelect(index)}
            >
              {getChoiceIcon(index)}
              <span className="text-base font-medium">
                {String.fromCharCode(65 + index)}) {choiceText}
              </span>

              {isValidated && (
                <div className="ml-auto flex flex-col items-end gap-1">
                  {isGoodSelection && (
                    <span className="text-[10px] font-bold tracking-wider text-green-500 uppercase">
                      {t("quiz.validation.well_chosen")}
                    </span>
                  )}
                  {isMissedOption && (
                    <span className="text-[10px] font-bold tracking-wider text-yellow-500 uppercase opacity-80">
                      {t("quiz.validation.correct_answer")}
                    </span>
                  )}
                  {isBadSelection && (
                    <span className="text-[10px] font-bold tracking-wider text-red-500 uppercase">
                      {t("quiz.validation.incorrect")}
                    </span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
})

ChoiceQuestionComponent.displayName = "ChoiceQuestionComponent"
