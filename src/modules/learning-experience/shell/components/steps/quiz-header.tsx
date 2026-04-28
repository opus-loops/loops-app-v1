import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { StartedQuiz } from "@/modules/shared/domain/entities/started-quiz"
import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"

import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { cn } from "@/modules/shared/lib/utils"

import type { SubQuizRef } from "../question-types/sequence-order-component"

import { getQuizTimerPresentationState } from "./quiz-header-timer-state"

type QuizHeaderProps = {
  isTimerRunning: boolean
  quizItem: { contentType: "quizzes" } & CategoryContentItem
  selectedSubQuiz: EnhancedSubQuiz | undefined
  setIsTimerRunning: (isRunning: boolean) => void
  setTimeLeft: (time: ((prev: number) => number) | number) => void
  subQuizRef: React.RefObject<null | SubQuizRef>
  timeLeft: number
}

export function QuizHeader({
  isTimerRunning,
  quizItem,
  selectedSubQuiz,
  setIsTimerRunning,
  setTimeLeft,
  subQuizRef,
  timeLeft,
}: QuizHeaderProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion() ?? false
  const estimatedTime = selectedSubQuiz?.content?.estimatedTime ?? 0
  const isCompleted = selectedSubQuiz?.completedQuestion?.status === "completed"
  const [isSpotlightVisible, setIsSpotlightVisible] = useState(
    () => estimatedTime > 0 && !isCompleted && !shouldReduceMotion,
  )

  // Reset timer and validation state when question changes
  useEffect(() => {
    setTimeLeft(estimatedTime)
    setIsTimerRunning(!isCompleted && estimatedTime > 0)
  }, [
    selectedSubQuiz?.subQuizId,
    estimatedTime,
    selectedSubQuiz?.questionType,
    setTimeLeft,
    setIsTimerRunning,
  ])

  useEffect(() => {
    if (!isTimerRunning || timeLeft <= 0) {
      if (timeLeft === 0 && isTimerRunning) {
        setIsTimerRunning(false)
        subQuizRef.current?.skip(true)
      }
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1))
    }, 1000)

    return () => clearInterval(timer)
  }, [isTimerRunning, timeLeft, setIsTimerRunning, subQuizRef, setTimeLeft])

  useEffect(() => {
    if (estimatedTime <= 0 || isCompleted || shouldReduceMotion) {
      setIsSpotlightVisible(false)
      return
    }

    setIsSpotlightVisible(true)

    const spotlightTimer = window.setTimeout(() => {
      setIsSpotlightVisible(false)
    }, 850)

    return () => window.clearTimeout(spotlightTimer)
  }, [
    estimatedTime,
    isCompleted,
    selectedSubQuiz?.subQuizId,
    shouldReduceMotion,
  ])

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
      ? selectedSubQuiz.content?.isMultiple
        ? t("quiz.multiple_answers")
        : t("quiz.single_answer")
      : t("quiz.arrange_items")

  const timerPresentation = useMemo(
    () =>
      getQuizTimerPresentationState({
        estimatedTime,
        isTimerRunning,
        shouldReduceMotion,
        timeLeft,
      }),
    [estimatedTime, isTimerRunning, shouldReduceMotion, timeLeft],
  )

  const timerStyle = {
    default: {
      badgeClassName: "bg-[#ffe3d6] text-[#ff4900]",
      shadowClassName: "shadow-none",
    },
    green: {
      badgeClassName: "bg-emerald-100 text-emerald-700",
      shadowClassName: "shadow-emerald-500/20",
    },
    orange: {
      badgeClassName: "bg-orange-100 text-orange-700",
      shadowClassName: "shadow-orange-500/20",
    },
    red: {
      badgeClassName: "bg-red-100 text-red-700",
      shadowClassName: "shadow-red-500/25",
    },
    yellow: {
      badgeClassName: "bg-yellow-100 text-yellow-700",
      shadowClassName: "shadow-yellow-500/20",
    },
  }[timerPresentation.urgency]

  const timerAnimate = isSpotlightVisible
    ? { scale: [1.34, 1], y: [-10, 0] }
    : timerPresentation.isPulseActive
      ? { scale: [1, 1.18, 1], y: [0, -2, 0] }
      : { scale: 1, y: 0 }

  const timerTransition = shouldReduceMotion
    ? { duration: 0 }
    : isSpotlightVisible
      ? {
          damping: 22,
          duration: 0.55,
          stiffness: 220,
          type: "spring" as const,
        }
      : timerPresentation.isPulseActive
        ? {
            duration: 0.9,
            ease: "easeInOut" as const,
            repeat: Infinity,
            repeatType: "loop" as const,
          }
        : { duration: 0.2 }

  const timerValue =
    estimatedTime > 0 ? `${Math.max(0, timeLeft)}${t("common.sec")}` : "--"

  return (
    <div className="mx-auto w-full max-w-2xl px-2">
      <AnimatePresence>
        {isSpotlightVisible ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="pointer-events-none fixed inset-0 z-40 bg-black/80"
            data-testid="quiz-timer-spotlight"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        ) : null}
      </AnimatePresence>

      <p className="text-4 text-center leading-6 tracking-[-0.7px]">
        <span className="text-loops-orange font-semibold">
          {t("quiz.header_prefix")}
        </span>{" "}
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
              {`${t("quiz.question")} ${Math.max(1, selectedSubQuiz.index + 1)}`}
            </span>
          )}
          <span className="text-loops-light text-[18px] leading-[23px]">
            {`/${totalQuestions}`}
          </span>
        </div>

        <motion.div
          animate={timerAnimate}
          className="relative z-50"
          data-pulse-active={timerPresentation.isPulseActive}
          data-pulse-step={timerPresentation.pulseStep ?? undefined}
          data-testid="quiz-timer-badge"
          data-urgency={timerPresentation.urgency}
          initial={shouldReduceMotion ? false : { scale: 1, y: 0 }}
          transition={timerTransition}
        >
          <div
            className={cn(
              "flex min-w-24 items-center justify-center gap-2 rounded-full px-3 py-1.5 shadow-lg",
              timerStyle.badgeClassName,
              isSpotlightVisible && timerStyle.shadowClassName,
            )}
          >
            <div className="h-6 w-6">
              <TimerIcon />
            </div>
            <span
              className="text-[13px] leading-4 font-semibold whitespace-nowrap tabular-nums"
              data-testid="quiz-timer-value"
            >
              {timerValue}
            </span>
          </div>
        </motion.div>
      </div>

      <p className="mt-2 text-[18px] leading-[23px] text-[#858e96]">
        {subtitle}
      </p>

      <div className="border-loops-cyan mt-5 w-full border-b border-dashed" />
    </div>
  )
}
