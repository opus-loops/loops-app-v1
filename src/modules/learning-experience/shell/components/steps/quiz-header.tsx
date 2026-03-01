import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { StartedQuiz } from "@/modules/shared/domain/entities/started-quiz"
import { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { useEffect, useMemo } from "react"
import { SubQuizRef } from "../question-types/sequence-order-component"

type QuizHeaderProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
  selectedSubQuiz: EnhancedSubQuiz | undefined
  isTimerRunning: boolean
  setIsTimerRunning: (isRunning: boolean) => void
  subQuizRef: React.RefObject<SubQuizRef | null>
  timeLeft: number
  setTimeLeft: (time: number | ((prev: number) => number)) => void
}

export function QuizHeader({
  quizItem,
  selectedSubQuiz,
  isTimerRunning,
  setIsTimerRunning,
  subQuizRef,
  timeLeft,
  setTimeLeft,
}: QuizHeaderProps) {
  const estimatedTime = selectedSubQuiz?.content?.estimatedTime ?? 0
  const isCompleted = selectedSubQuiz?.completedQuestion?.status === "completed"

  // Reset timer and validation state when question changes
  useEffect(() => {
    setTimeLeft(estimatedTime)
    setIsTimerRunning(!isCompleted && estimatedTime > 0)
  }, [
    selectedSubQuiz?.subQuizId,
    estimatedTime,
    isCompleted,
    selectedSubQuiz?.questionType,
    setTimeLeft,
    setIsTimerRunning,
  ])

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      if (timeLeft === 0 && isTimerRunning) {
        setIsTimerRunning(false)
        subQuizRef.current?.skip()
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning, timeLeft, setIsTimerRunning, subQuizRef, setTimeLeft])

  const totalQuestions = quizItem.content.questionsCount

  const progressPercent = useMemo(() => {
    const completedCount = (quizItem.itemProgress as StartedQuiz)
      .completedQuestions

    return totalQuestions > 0
      ? Math.min(100, Math.round((completedCount / totalQuestions) * 100))
      : 0
  }, [quizItem, totalQuestions])

  const subtitle =
    selectedSubQuiz?.questionType === "choiceQuestions"
      ? selectedSubQuiz?.content?.isMultiple
        ? "Multiple correct answers"
        : "One correct answer"
      : "Arrange the items in order"

  return (
    <div className="mx-auto w-full max-w-2xl px-2">
      <p className="text-center text-[16px] leading-[23px] tracking-[-0.7px]">
        <span className="text-loops-orange font-semibold">Quiz:</span>{" "}
        <span className="text-loops-light font-semibold">
          {quizItem.content.label[0].content}
        </span>
      </p>

      <div className="mt-6 h-3 w-full rounded-2xl bg-[#f4f3f6]">
        <div
          className="bg-loops-cyan h-3 rounded-2xl"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-end gap-2">
          {selectedSubQuiz && (
            <span className="text-[32px] leading-[38px] font-semibold text-[#ff4900]">
              {`Question ${Math.max(1, selectedSubQuiz.index + 1)}`}
            </span>
          )}
          <span className="text-loops-light text-[18px] leading-[23px]">
            {`/${totalQuestions}`}
          </span>
        </div>

        <div className="flex min-w-[82px] items-center gap-2 rounded-full bg-[#ffe3d6] px-3 py-1">
          <div className="h-6 w-6 text-[#ff4900]">
            <TimerIcon />
          </div>
          <span className="text-[13px] leading-[16px] text-[#ff4900]">
            {timeLeft ? `${timeLeft}sec` : "--"}
          </span>
        </div>
      </div>

      <p className="mt-2 text-[18px] leading-[23px] text-[#858e96]">
        {subtitle}
      </p>

      <div className="border-loops-cyan mt-5 w-full border-b border-dashed" />
    </div>
  )
}
