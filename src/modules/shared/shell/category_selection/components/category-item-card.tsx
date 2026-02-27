import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ProgressState } from "@/modules/shared/utils/types"
import { QuizCard } from "./quiz-card"
import { SkillCard } from "./skill-card"

type CategoryItemCardProps = {
  item: CategoryContentItem
  index: number
}

export function CategoryItemCard({ item, index }: CategoryItemCardProps) {
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
        item={item}
        index={index}
        progressState={progressState}
        progress={progress}
      />
    )
  }

  return (
    <QuizCard
      item={item}
      index={index}
      progressState={progressState}
      progress={progress}
    />
  )
}
