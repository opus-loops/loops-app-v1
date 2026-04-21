import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { Button } from "@/modules/shared/components/ui/button"

import { useSubQuizNavigation } from "./steps/use-sub-quiz-navigation"

type QuizActionButtonProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
}

export function QuizActionButton({ quizItem }: QuizActionButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useTranslation()
  const { initializeQuiz, startedQuiz } = useSubQuizNavigation({
    quizItem,
  })

  const handleStartQuiz = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    await initializeQuiz()
    setIsSubmitting(false)
  }

  const isStarted = startedQuiz !== undefined
  const isCompleted = startedQuiz?.status === "completed"

  return (
    <Button
      className="font-outfit text-loops-light hover:bg-loops-cyan/90 bg-loops-cyan flex w-full max-w-sm items-center justify-center rounded-xl px-6 py-3 text-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={isSubmitting}
      onClick={handleStartQuiz}
      type="button"
    >
      {isSubmitting
        ? t("common.starting")
        : isCompleted
          ? t("common.view_answers")
          : isStarted
            ? t("common.continue")
            : t("common.start")}
      {!isSubmitting && <ChevronRight className="text-loops-main h-5 w-5" />}
    </Button>
  )
}
