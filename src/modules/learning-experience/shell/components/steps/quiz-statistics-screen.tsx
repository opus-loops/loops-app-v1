import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { NoteIcon } from "@/modules/shared/components/icons/note"
import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useContentNavigation } from "@/modules/shared/navigation"
import { useState } from "react"
import { useQuizStepper } from "../quiz-stepper"

type QuizStatisticsScreenProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60)
  const remainingSeconds = (totalSeconds % 60).toString().padStart(2, "0")
  return `${minutes}:${remainingSeconds}`
}

export function QuizStatisticsScreen({ quizItem }: QuizStatisticsScreenProps) {
  const { itemProgress: startedQuiz } = quizItem
  const [isLoading, setIsLoading] = useState(false)

  const {
    navigateToNext,
    canNavigateNext,
    exitContent,
    isNextItemCompleted,
    validateAndStartItem,
  } = useContentNavigation({ categoryId: quizItem.categoryId })

  const { goToStep } = useQuizStepper()

  const completedQuestions = startedQuiz?.completedQuestions ?? 0
  const totalQuestions = quizItem.content.questionsCount
  const score = startedQuiz?.score ?? 0
  const spentTime = startedQuiz?.spentTime ?? 0

  const handleNextClick = async () => {
    setIsLoading(true)

    // Check if we can navigate to next item
    const canNavigate = canNavigateNext && isNextItemCompleted

    if (canNavigate) {
      // Normal navigation - next item is already started
      setIsLoading(false)
      return await navigateToNext()
    }

    // Try to start the next item and navigate to it
    const isSuccess = await validateAndStartItem()

    setIsLoading(false)

    // Successfully started next item, now navigate
    if (isSuccess) {
      await navigateToNext()
      goToStep("welcome")
    }
  }

  const handleBackToHome = () => {
    exitContent()
  }

  return (
    <div className="font-outfit flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#000016] px-9">
      {/* Container matching Figma frame1000009848 */}
      <div className="flex w-full max-w-[390px] flex-col items-center gap-10">
        {/* Main Content Card */}
        <div className="flex w-full flex-col items-center gap-4 rounded-3xl pb-6">
          {/* Mascot Image */}
          <div className="h-[282px] w-[316px]">
            <img
              src="/assets/images/winning-loops.png"
              alt="Winning Loops Mascot"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Celebration Text */}
          <div className="flex flex-col items-start gap-1 px-[7px]">
            <h1 className="w-[303px] text-center text-2xl font-semibold tracking-normal text-[#ff4900]">
              Congrats !
            </h1>
            <p className="w-[303px] text-center text-base tracking-[0.2px] text-[#dee2e6] opacity-80">
              You passed the first Quiz
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
                <p className="text-[16px] text-[#31bce6]">Quizzes</p>
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
                <p className="text-[16px] text-[#ffcc00]">XP</p>
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
                <p className="text-[16px] text-[#ff4900]">Time</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex w-full flex-col items-start gap-4">
          {/* Primary Button */}
          <button
            onClick={handleNextClick}
            disabled={isLoading}
            className="font-outfit w-full max-w-sm rounded-xl bg-cyan-400 px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Loading..." : "Next"}
          </button>

          {/* Secondary Button */}
          <button
            className="border-loops-cyan flex h-[54px] w-full items-center justify-center rounded-lg border bg-transparent text-lg font-medium text-[#31bce6] transition-colors hover:bg-[#31bce6]/10 hover:text-[#31bce6]"
            onClick={handleBackToHome}
          >
            Back to home
          </button>
        </div>
      </div>
    </div>
  )
}
