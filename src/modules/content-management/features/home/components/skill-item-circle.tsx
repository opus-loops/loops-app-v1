import { useRouter } from "@tanstack/react-router"
import { useState } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ProgressState } from "@/modules/shared/utils/types"

import { BookIcon } from "@/modules/shared/components/icons/book"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { cn } from "@/modules/shared/lib/utils"
import { FreeTrialDialog } from "@/modules/shared/shell/category_selection/components/free-trial-dialog"
import { useStartSkill } from "@/modules/shared/shell/category_selection/services/use-start-skill"

import { BaseItemCircle } from "./shared/item-circle-base"
import {
  getCircleColors,
  getItemClickability,
  isItemStartable,
} from "./shared/item-circle-utils"

export type SkillItemCircleProps = {
  categoryId: string
  index: number
  item: { contentType: "skills" } & CategoryContentItem
  previousItems: Array<CategoryContentItem>
}

export function SkillItemCircle({
  categoryId,
  index,
  item,
  previousItems,
}: SkillItemCircleProps) {
  const { error } = useToast()
  const router = useRouter()
  const { handleStartSkill } = useStartSkill()
  const [isLoading, setIsLoading] = useState(false)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)
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
        search: {
          category: categoryId,
          contentId: item.itemId,
          type: "content",
        },
        to: "/",
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
      if (response.error.code === "max_free_items_reached") {
        setIsVoucherDialogOpen(true)
        return
      }
      error("Failed to start skill")
      return
    }

    setSelectedContent(item)
    router.navigate({
      search: {
        category: categoryId,
        contentId: item.itemId,
        type: "content",
      },
      to: "/",
    })
  }

  const progress = getProgress()
  const isFirstItem = index === 0
  const progressState = getProgressState()
  const startable = isItemStartable(index, previousItems)
  const colors = getCircleColors(progressState, isFirstItem, startable)
  const isClickable = getItemClickability(progressState, startable)

  return (
    <>
      <BaseItemCircle
        colors={colors}
        index={index}
        isClickable={isClickable}
        isLoading={isLoading}
        onClick={handleClick}
        progress={progress}
      >
        {progressState === "locked" && startable === false && (
          <div className={cn("h-10 w-10 shrink-0 grow-0", colors.text)}>
            <LockIcon />
          </div>
        )}

        {(progressState !== "locked" || startable === true) && (
          <div className="flex flex-col items-center justify-center">
            <div className={cn("h-10 w-10 shrink-0 grow-0", colors.text)}>
              <BookIcon />
            </div>
          </div>
        )}
      </BaseItemCircle>
      <FreeTrialDialog
        categoryId={categoryId}
        onOpenChange={setIsVoucherDialogOpen}
        open={isVoucherDialogOpen}
      />
    </>
  )
}
