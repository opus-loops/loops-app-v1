import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useSubQuizNavigation } from "./steps/use-sub-quiz-navigation"

type QuizActionButtonProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

export function QuizActionButton({ quizItem }: QuizActionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { initializeQuiz } = useSubQuizNavigation({
    quizItem,
  })

  const handleStartQuiz = async () => {
    if (isLoading) return
    setIsLoading(true)
    await initializeQuiz()
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleStartQuiz}
      disabled={isLoading}
      className="font-outfit flex w-full max-w-sm items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-lg font-medium text-white transition-all duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className="font-outfit text-[18px] font-medium text-[#15153a]">
        {isLoading ? "Starting..." : "Start"}
      </span>
      {!isLoading && <ChevronRight className="h-5 w-5 text-[#15153a]" />}
    </button>
  )
}
