import { Suspense } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { BottomTabNavigator } from "@/modules/shared/components/navigation/bottom-tab-navigator"
import { useContentNavigation } from "@/modules/shared/navigation"

import { SelectedSubQuizProvider } from "../../contexts/selected-sub-quiz-context"
import { CategoryContentNavigationHeader } from "./category-content-navigation-header"
import { QuizStepper } from "./quiz-stepper"
import { QuizStatisticsScreen } from "./steps/quiz-statistics-screen"
import { QuizWelcomeScreen } from "./steps/quiz-welcome-screen"
import { SubQuizzesNavigator } from "./steps/sub-quizzes-navigator"

type QuizContentScreenProps = {
  quizItem: { contentType: "quizzes" } & CategoryContentItem
}

export function QuizContentScreen({ quizItem }: QuizContentScreenProps) {
  const title = quizItem.content.label[0].content

  const {
    canNavigateNext,
    canNavigatePrevious,
    navigateToNext,
    navigateToPrevious,
  } = useContentNavigation({
    categoryId: quizItem.categoryId,
  })

  return (
    <div className="bg-loops-background flex h-full flex-col">
      <div className="px-4 py-6">
        <CategoryContentNavigationHeader
          canNavigateNext={canNavigateNext}
          canNavigatePrevious={canNavigatePrevious}
          contentType="quizzes"
          onNext={navigateToNext}
          onPrevious={navigateToPrevious}
          title={title}
        />
      </div>

      <div className="mb-10 flex-1 overflow-y-auto px-7 pb-20">
        <SelectedSubQuizProvider>
          <Suspense fallback={<ContentSkeleton />}>
            <QuizStepper
              quizItem={quizItem}
              statistics={<QuizStatisticsScreen quizItem={quizItem} />}
              subQuizzesNavigator={<SubQuizzesNavigator quizItem={quizItem} />}
              welcome={<QuizWelcomeScreen quizItem={quizItem} />}
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
