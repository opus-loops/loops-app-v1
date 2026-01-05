import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { NoteIcon } from "@/modules/shared/components/icons/note"
import { TimerIcon } from "@/modules/shared/components/icons/timer"
import { Button } from "@/modules/shared/components/ui/button"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useQuizStepper } from "../quiz-stepper"
import { useSubQuizNavigation } from "./use-sub-quiz-navigation"

type QuizWelcomeScreenProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
}

export function QuizWelcomeScreen({ quizItem }: QuizWelcomeScreenProps) {
  const { goToStep, currentStep } = useQuizStepper()

  const { canNavigateNext, navigateNext } = useSubQuizNavigation({
    currentQuizStep: currentStep,
    quizItem,
  })

  const handleStartQuiz = async () => {
    if (canNavigateNext) {
      await navigateNext()
      goToStep("sub-quizzes")
    }
  }

  return (
    <div className="bg-loops-background flex h-full flex-col">
      {/* Content Area */}
      <div className="flex-1 px-4 pb-20">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-sm">
            {/* Quiz Content Box - Inspired by the box design */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <div className="relative mx-auto mb-6 flex h-26 w-26 items-center justify-center">
                {/* Glow Effect */}
                <div className="absolute inset-0 z-0 rounded-full bg-cyan-400/20 blur-sm"></div>
                <div className="text-loops-cyan z-10 h-24 w-24 shrink-0 grow-0">
                  <NoteIcon />
                </div>
              </div>

              {/* Title */}
              <h2 className="font-outfit mb-4 text-center text-2xl font-medium text-gray-900">
                Quiz Ready
              </h2>

              {/* Stats */}
              <div className="mb-6 flex items-end justify-center gap-8">
                <div className="flex flex-col items-center">
                  <div className="mb-3 h-10 w-10 shrink-0 grow-0 text-purple-600">
                    <NoteIcon />
                  </div>
                  <div className="text-center">
                    <p className="font-outfit text-xl font-semibold text-gray-900">
                      {quizItem.content.questionsCount}
                    </p>
                    <p className="font-outfit text-sm text-gray-600">
                      Questions
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 h-10 w-10 shrink-0 grow-0 text-yellow-600">
                    <HalfStarIcon />
                  </div>
                  <div className="text-center">
                    <p className="font-outfit text-xl font-semibold text-gray-900">
                      {quizItem.content.score}
                    </p>
                    <p className="font-outfit text-sm text-gray-600">XP</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="mb-3 h-10 w-10 shrink-0 grow-0 text-orange-600">
                    <TimerIcon />
                  </div>
                  <div className="text-center">
                    <p className="font-outfit text-xl font-semibold text-gray-900">
                      {quizItem.content.totalTime}
                    </p>
                    <p className="font-outfit text-sm text-gray-600">Second</p>
                  </div>
                </div>
              </div>

              <Button
                className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
                type="button"
                onClick={handleStartQuiz}
              >
                Start Quiz
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
