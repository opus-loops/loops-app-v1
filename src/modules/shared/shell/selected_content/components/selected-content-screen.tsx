import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { QuizContentScreen } from "@/modules/learning-experience/shell/components/quiz-content-screen"
import { SkillContentScreen } from "@/modules/learning-experience/shell/components/skill-content-screen"
import { useContentNavigation } from "@/modules/shared/navigation"

type SelectedContentScreenProps = {
  selectedItem: CategoryContentItem
}

export function SelectedContentScreen({
  selectedItem,
}: SelectedContentScreenProps) {
  const { handleBackNavigation } = useContentNavigation({
    categoryId: selectedItem.categoryId,
  })

  return (
    <div className="relative flex-1 overflow-hidden">
      {selectedItem.contentType === "skills" && (
        <SkillContentScreen
          onBack={handleBackNavigation}
          skillItem={selectedItem}
        />
      )}

      {selectedItem.contentType === "quizzes" && (
        <QuizContentScreen
          onBack={handleBackNavigation}
          quizItem={selectedItem}
        />
      )}
    </div>
  )
}
