import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { NoteIcon } from "@/modules/shared/components/icons/note"
import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { useContentNavigation } from "@/modules/shared/navigation"
import { VoucherDialog } from "@/modules/shared/shell/category_selection/components/voucher-dialog"

import { useQuizStepper } from "../quiz-stepper"

type CelebrationParticle = {
  color: string
  delay: number
  duration: number
  id: string
  rotate: number
  size: number
  x: number
  y: number
}

type QuizStatisticsScreenProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0")
  return `${minutes}:${remainingSeconds}`
}

export function QuizStatisticsScreen({ quizItem }: QuizStatisticsScreenProps) {
  const { itemProgress: startedQuiz } = quizItem
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCelebrationActive, setIsCelebrationActive] = useState(true)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)
  const { t } = useTranslation()

  const {
    canNavigateNext,
    exitContent,
    isNextItemCompleted,
    navigateToNext,
    validateAndStartItem,
  } = useContentNavigation({ categoryId: quizItem.categoryId })

  const { goToStep } = useQuizStepper()

  const completedQuestions = startedQuiz?.completedQuestions ?? 0
  const totalQuestions = quizItem.content.questionsCount
  const score = startedQuiz?.score ?? 0
  const spentTime = startedQuiz?.spentTime ?? 0
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (shouldReduceMotion) {
      setIsCelebrationActive(false)
      return
    }

    const timeoutId = window.setTimeout(() => {
      setIsCelebrationActive(false)
    }, 2400)

    return () => window.clearTimeout(timeoutId)
  }, [shouldReduceMotion])

  const handleNextClick = async () => {
    setIsSubmitting(true)

    // Check if we can navigate to next item
    const canNavigate = canNavigateNext && isNextItemCompleted

    if (canNavigate) {
      // Normal navigation - next item is already started
      setIsSubmitting(false)
      return await navigateToNext()
    }

    // Try to start the next item and navigate to it
    const response = await validateAndStartItem()

    setIsSubmitting(false)

    // Successfully started next item, now navigate
    if (
      response._tag === "Failure" &&
      response.error.code === "max_free_items_reached"
    ) {
      setIsVoucherDialogOpen(true)
      return
    }

    if (response._tag === "Success") {
      await navigateToNext()
      goToStep("welcome")
    }
  }

  const handleBackToHome = () => {
    exitContent()
  }

  return (
    <div className="font-outfit relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#000016] px-9">
      <CelebrationParticles isActive={isCelebrationActive} />
      <VoucherDialog
        categoryId={quizItem.categoryId}
        description={t("voucher.dialog.description")}
        onOpenChange={setIsVoucherDialogOpen}
        open={isVoucherDialogOpen}
        showFreeTrial={false}
        showTrigger={false}
        title={t("voucher.dialog.title")}
      />
      {/* Container matching Figma frame1000009848 */}
      <div className="flex w-full max-w-[390px] flex-col items-center gap-10">
        {/* Main Content Card */}
        <div className="flex w-full flex-col items-center gap-4 rounded-3xl pb-6">
          {/* Mascot Image */}
          <div className="h-[282px] w-[316px]">
            <img
              alt={t("quiz.winning_mascot_alt")}
              className="h-full w-full object-contain"
              src="/images/winning-loops.png"
            />
          </div>

          {/* Celebration Text */}
          <div className="flex flex-col items-start gap-1 px-[7px]">
            <h1 className="w-[303px] text-center text-2xl font-semibold tracking-normal text-[#ff4900]">
              {t("quiz.congrats")}
            </h1>
            <p className="w-[303px] text-center text-base tracking-[0.2px] text-[#dee2e6] opacity-80">
              {t("quiz.passed_message")}
            </p>
          </div>

          {/* Stats Card */}
          <div className="flex w-full items-end justify-center gap-x-8 px-2">
            {/* Quizzes Stat */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 text-[#31bce6]">
                <NoteIcon />
              </div>
              <div className="text-center">
                <p className="text-[20px] font-semibold text-[#31bce6]">
                  {completedQuestions}/{totalQuestions}
                </p>
                <p className="text-[16px] text-[#31bce6]">
                  {t("quiz.stats.quizzes")}
                </p>
              </div>
            </div>

            {/* XP Stat */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 text-[#ffcc00]">
                <HalfStarIcon />
              </div>
              <div className="text-center">
                <p className="text-[20px] font-semibold text-[#ffcc00]">
                  {score}
                </p>
                <p className="text-[16px] text-[#ffcc00]">
                  {t("quiz.stats.xp")}
                </p>
              </div>
            </div>

            {/* Time Stat */}
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 text-[#ff4900]">
                <TimerIcon />
              </div>
              <div className="text-center">
                <p className="text-[20px] font-semibold text-[#ff4900]">
                  {formatTime(spentTime)}
                </p>
                <p className="text-[16px] text-[#ff4900]">
                  {t("quiz.stats.time")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-start gap-4">
          {/* Primary Button */}
          <button
            className="font-outfit text-loops-light w-full max-w-sm rounded-xl bg-cyan-400 px-6 py-3 text-lg font-medium transition-all duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            onClick={handleNextClick}
          >
            {isSubmitting ? t("common.loading") : t("quiz.next")}
          </button>

          {/* Secondary Button */}
          <button
            className="border-loops-cyan flex h-[54px] w-full items-center justify-center rounded-lg border bg-transparent text-lg font-medium text-[#31bce6] transition-colors hover:bg-[#31bce6]/10 hover:text-[#31bce6]"
            onClick={handleBackToHome}
          >
            {t("quiz.back_home")}
          </button>
        </div>
      </div>
    </div>
  )
}

function CelebrationParticles({ isActive }: { isActive: boolean }) {
  const shouldReduceMotion = useReducedMotion()

  const particles = useMemo<Array<CelebrationParticle>>(() => {
    if (!isActive || shouldReduceMotion) return []

    const colors = ["#31bce6", "#ffcc00", "#ff4900", "#ffffff"]

    return Array.from({ length: 44 }, (_, index) => {
      const angle = Math.random() * Math.PI * 2
      const distance = 140 + Math.random() * 220
      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance - (60 + Math.random() * 80)
      const size = 5 + Math.random() * 7

      return {
        color: colors[Math.floor(Math.random() * colors.length)] ?? "#ffffff",
        delay: Math.random() * 0.2,
        duration: 1.3 + Math.random() * 0.9,
        id: `${index}-${Math.random().toString(16).slice(2)}`,
        rotate: (Math.random() * 220 - 110) * (Math.random() > 0.5 ? 1 : -1),
        size,
        x,
        y,
      }
    })
  }, [isActive, shouldReduceMotion])

  return (
    <AnimatePresence>
      {isActive && !shouldReduceMotion ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {particles.map((particle) => (
            <motion.span
              animate={{
                opacity: [0, 1, 0],
                rotate: particle.rotate,
                scale: [0.9, 1, 0.7],
                x: particle.x,
                y: particle.y,
              }}
              className="absolute rounded-full"
              initial={{ opacity: 0, rotate: 0, scale: 0.9, x: 0, y: 0 }}
              key={particle.id}
              style={{
                backgroundColor: particle.color,
                boxShadow: `0 0 16px ${particle.color}66`,
                height: particle.size,
                left: "50%",
                top: "38%",
                width: particle.size,
              }}
              transition={{
                delay: particle.delay,
                duration: particle.duration,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
