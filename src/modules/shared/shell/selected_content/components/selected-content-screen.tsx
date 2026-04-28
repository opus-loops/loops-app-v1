import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { QuizContentScreen } from "@/modules/learning-experience/shell/components/quiz-content-screen"
import { SkillContentScreen } from "@/modules/learning-experience/shell/components/skill-content-screen"

type SelectedContentScreenProps = {
  selectedItem: CategoryContentItem
}

export function SelectedContentScreen({
  selectedItem,
}: SelectedContentScreenProps) {
  return (
    <div className="relative flex-1 overflow-hidden">
      {selectedItem.contentType === "skills" && (
        <SkillContentScreen skillItem={selectedItem} />
      )}

      {selectedItem.contentType === "quizzes" && (
        <QuizContentScreen quizItem={selectedItem} />
      )}
    </div>
  )
}
