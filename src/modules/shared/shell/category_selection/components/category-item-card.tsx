import { QuizCard } from "./quiz-card"
import { SkillCard } from "./skill-card"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ProgressState } from "@/modules/shared/utils/types"

type CategoryItemCardProps = {
  index: number
  item: CategoryContentItem
}

export function CategoryItemCard({ index, item }: CategoryItemCardProps) {
  const getProgressState = (): ProgressState => {
    if (item.contentType === "skills") {
      if (item.itemProgress?.isCompleted) return "completed"
      if (item.itemProgress) return "started"
      return "locked"
    } else {
      // For quizzes
      if (item.itemProgress?.status === "completed") return "completed"
      if (item.itemProgress) return "started"
      return "locked"
    }
  }

  const getProgress = (): number => {
    if (item.contentType === "skills") {
      if (item.itemProgress?.isCompleted) return 100
      // Calculate progress based on score (assuming max score is 100)
      if (item.itemProgress) return Math.min(item.itemProgress.score, 100)
      return 0
    } else {
      // For quizzes
      if (item.itemProgress?.status === "completed") return 100
      // Calculate progress based on completed questions
      if (item.itemProgress && item.content.questionsCount > 0)
        return Math.round(
          (item.itemProgress.completedQuestions / item.content.questionsCount) *
            100,
        )
      return 0
    }
  }

  const progressState = getProgressState()
  const progress = getProgress()

  if (item.contentType === "skills") {
    return (
      <SkillCard
        index={index}
        item={item}
        progress={progress}
        progressState={progressState}
      />
    )
  }

  return (
    <QuizCard
      index={index}
      item={item}
      progress={progress}
      progressState={progressState}
    />
  )
}
