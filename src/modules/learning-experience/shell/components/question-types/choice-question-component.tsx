import { QuestionValidationPopup } from "@/modules/learning-experience/shell/components/question-types/question-validation-popup"
import { cn } from "@/modules/shared/lib/utils"
import { useValidateChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-validate-choice-question"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"

export type SubQuizRef = {
  skip: () => void
  validate: (timeLeft: number) => Promise<void>
}

type ChoiceQuestionComponentProps = {
  subQuiz: EnhancedSubQuiz & { questionType: "choiceQuestions" }
  categoryId: string
  onStopTimer: () => void
}

export const ChoiceQuestionComponent = forwardRef<
  SubQuizRef,
  ChoiceQuestionComponentProps
>(({ subQuiz, categoryId, onStopTimer }, ref) => {
  const { handleValidateChoiceQuestion } = useValidateChoiceQuestion()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedChoices, setSelectedChoices] = useState<number[]>([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const pendingValidationQuestionIdRef = useRef<string | null>(null)

  const question = subQuiz.content
  const completedQuestion = subQuiz.completedQuestion

  const isValidated = completedQuestion?.status === "completed"

  useEffect(() => {
    setIsPopupOpen(false)
    setSelectedChoices([])
    pendingValidationQuestionIdRef.current = null
  }, [subQuiz.questionId])

  useEffect(() => {
    if (!isValidated) return
    if (pendingValidationQuestionIdRef.current !== subQuiz.questionId) return
    setIsPopupOpen(true)
    pendingValidationQuestionIdRef.current = null
  }, [isValidated])

  useImperativeHandle(ref, () => ({
    skip: async () => {
      if (isSubmitting || isValidated) return
      setIsSubmitting(true)
      await handleValidateChoiceQuestion({
        categoryId,
        quizId: subQuiz.quizId,
        questionId: subQuiz.questionId,
        userAnswer: undefined,
        spentTime: question?.estimatedTime ?? 0,
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
        quizId: subQuiz.quizId,
        questionId: subQuiz.questionId,
        userAnswer: selectedChoices,
        spentTime,
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
    const toCounts = (values: readonly number[]) => {
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

  const popupVariant = isCorrectAnswer ? "correct" : "incorrect"

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
        "flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all",
        "bg-slate-800 border-slate-600 text-white hover:border-slate-500",
        isSelected && "border-cyan-400 bg-slate-700",
      )
    } else {
      // Validated state - show correct/incorrect
      const isCorrect = question.idealOptions?.includes(index)
      const wasSelected =
        completedQuestion?.userAnswer?.includes(index) ?? false

      if (isCorrect) {
        return cn(
          "flex items-center p-4 rounded-lg border-2",
          "bg-green-900/30 border-green-500 text-white",
        )
      } else if (wasSelected) {
        return cn(
          "flex items-center p-4 rounded-lg border-2",
          "bg-red-900/30 border-red-500 text-white",
        )
      } else {
        return cn(
          "flex items-center p-4 rounded-lg border-2",
          "bg-slate-800 border-slate-600 text-white opacity-60",
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
            "mr-3 flex h-6 w-6 items-center justify-center border-2",
            question.isMultiple ? "rounded-md" : "rounded-full",
            isSelected ? "border-cyan-400 bg-cyan-400" : "border-slate-400",
          )}
        >
          {isSelected &&
            (question.isMultiple ? (
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="h-2 w-2 rounded-full bg-white" />
            ))}
        </div>
      )
    } else {
      const isCorrect = question.idealOptions?.includes(index)
      const wasSelected =
        completedQuestion?.userAnswer?.includes(index) ?? false

      if (isCorrect) {
        return (
          <div
            className={cn(
              "mr-3 flex h-6 w-6 items-center justify-center bg-green-500",
              question.isMultiple ? "rounded-md" : "rounded-full",
            )}
          >
            <svg
              className="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      } else if (wasSelected) {
        return (
          <div
            className={cn(
              "mr-3 flex h-6 w-6 items-center justify-center bg-red-500",
              question.isMultiple ? "rounded-md" : "rounded-full",
            )}
          >
            <svg
              className="h-4 w-4 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )
      } else {
        return (
          <div
            className={cn(
              "mr-3 h-6 w-6 border-2 border-slate-400",
              question.isMultiple ? "rounded-md" : "rounded-full",
            )}
          />
        )
      }
    }
  }

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
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-xl leading-relaxed font-medium text-white">
          {question.headline[0].content}
        </h2>
      </div>

      {/* Choices */}
      <div className="space-y-4">
        {question.choices.map((choice, index) => {
          const choiceText =
            choice.find((c) => c.language === question.defaultLanguage)
              ?.content ||
            choice[0]?.content ||
            ""

          return (
            <div
              key={index}
              className={getChoiceStyle(index)}
              onClick={() => handleChoiceSelect(index)}
            >
              {getChoiceIcon(index)}
              <span className="text-base">
                {String.fromCharCode(65 + index)}) {choiceText}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
})
