import { BookIcon } from "@/modules/shared/components/icons/book"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { cn } from "@/modules/shared/lib/utils"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"
import { ProgressState } from "@/modules/shared/utils/types"
import { useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { BaseItemCircle } from "./shared/item-circle-base"
import {
  getCircleColors,
  getItemClickability,
  isItemStartable,
} from "./shared/item-circle-utils"

export type SkillItemCircleProps = {
  item: CategoryContentItem & { contentType: "skills" }
  index: number
  categoryId: string
  previousItems: Array<CategoryContentItem>
}

export function SkillItemCircle({
  item,
  index,
  categoryId,
  previousItems,
}: SkillItemCircleProps) {
  const { error } = useToast()
  const router = useRouter()
  const { handleStartSkill } = useStartSkill()
  const [isLoading, setIsLoading] = useState(false)
  const { setSelectedContent } = useSelectedContent()

  const getProgressState = (): ProgressState => {
    if (item.itemProgress === undefined) return "locked"
    if (item.itemProgress.isCompleted) return "completed"
    return "started"
  }

  const getProgress = (): number => {
    if (item.itemProgress?.isCompleted) return 100
    if (item.itemProgress) return Math.min(item.itemProgress.score, 100)
    return 0
  }

  const handleClick = async () => {
    if (progressState === "completed" || progressState === "started") {
      setSelectedContent(item)
      router.navigate({
        to: "/",
        search: {
          category: categoryId,
          type: "content",
          contentId: item.itemId,
        },
      })
      return
    }

    if (!startable) return

    setIsLoading(true)

    const response = await handleStartSkill({
      categoryId,
      skillId: item.itemId,
    })

    setIsLoading(false)

    if (response._tag === "Failure") {
      error("Failed to start skill")
      return
    }

    setSelectedContent(item)
    router.navigate({
      to: "/",
      search: {
        category: categoryId,
        type: "content",
        contentId: item.itemId,
      },
    })
  }

  const progress = getProgress()
  const isFirstItem = index === 0
  const progressState = getProgressState()
  const startable = isItemStartable(index, previousItems)
  const colors = getCircleColors(progressState, isFirstItem)
  const isClickable = getItemClickability(progressState, startable)

  return (
    <BaseItemCircle
      colors={colors}
      progress={progress}
      isClickable={isClickable}
      isLoading={isLoading}
      index={index}
      onClick={handleClick}
    >
      {progressState === "locked" && isFirstItem === false && (
        <div className={cn("h-10 w-10 shrink-0 grow-0", colors.text)}>
          <LockIcon />
        </div>
      )}

      {(isFirstItem !== false || progressState !== "locked") && (
        <div className="flex flex-col items-center justify-center">
          <div className={cn("h-10 w-10 shrink-0 grow-0", colors.text)}>
            <BookIcon />
          </div>
        </div>
      )}
    </BaseItemCircle>
  )
}
