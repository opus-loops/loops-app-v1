import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { BottomTabNavigator } from "@/modules/shared/components/navigation/bottom-tab-navigator"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { BackButton } from "@/modules/shared/shell/category_selection/components/back-button"
import { Suspense } from "react"
import { SelectedSubQuizProvider } from "../../contexts/selected-sub-quiz-context"
import { QuizStepper } from "./quiz-stepper"
import { QuizStatisticsScreen } from "./steps/quiz-statistics-screen"
import { QuizWelcomeScreen } from "./steps/quiz-welcome-screen"
import { SubQuizzesNavigator } from "./steps/sub-quizzes-navigator"

type QuizContentScreenProps = {
  quizItem: CategoryContentItem & { contentType: "quizzes" }
  onBack: () => void
}

export function QuizContentScreen({
  quizItem,
  onBack,
}: QuizContentScreenProps) {
  return (
    <div className="bg-loops-background flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        <BackButton onBack={onBack} />
        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          {quizItem.content.label[0].content}
        </h1>
      </div>

      <div className="mb-10 flex-1 overflow-y-auto px-7 pb-20">
        <SelectedSubQuizProvider>
          <Suspense fallback={<ContentSkeleton />}>
            <QuizStepper
              quizItem={quizItem}
              welcome={<QuizWelcomeScreen quizItem={quizItem} />}
              subQuizzesNavigator={<SubQuizzesNavigator quizItem={quizItem} />}
              statistics={<QuizStatisticsScreen />}
            />
          </Suspense>
        </SelectedSubQuizProvider>
      </div>

      {/* Bottom Tab Navigation */}
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2">
        <BottomTabNavigator />
      </div>
    </div>
  )
}
