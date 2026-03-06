import { Button } from "@/modules/shared/components/ui/button"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSubQuizNavigation } from "./steps/use-sub-quiz-navigation"

type QuizActionButtonProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
}

export function QuizActionButton({ quizItem }: QuizActionButtonProps) {
  const [canSubmit, setCanSubmit] = useState(false)
  const { t } = useTranslation()
  const { initializeQuiz } = useSubQuizNavigation({
    quizItem,
  })

  const handleStartQuiz = async () => {
    if (canSubmit) return
    setCanSubmit(true)
    await initializeQuiz()
    setCanSubmit(false)
  }

  return (
    <Button
      className="font-outfit text-loops-light hover:bg-loops-cyan/90 bg-loops-cyan flex w-full max-w-sm items-center justify-center rounded-xl px-6 py-3 text-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      disabled={canSubmit}
      onClick={handleStartQuiz}
      type="button"
    >
      {canSubmit ? t("common.starting") : t("common.start")}
      {!canSubmit && <ChevronRight className="text-loops-main h-5 w-5" />}
    </Button>
  )
}
