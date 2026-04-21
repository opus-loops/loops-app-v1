import { useRouter } from "@tanstack/react-router"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ProgressState } from "@/modules/shared/utils/types"

import { LockIcon } from "@/modules/shared/components/icons/lock"
import { MedalStarIcon } from "@/modules/shared/components/icons/medal-star"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { cn } from "@/modules/shared/lib/utils"
import { VoucherDialog } from "@/modules/shared/shell/category_selection/components/voucher-dialog"
import { useStartQuiz } from "@/modules/shared/shell/category_selection/services/use-start-quiz"

import { BaseItemCircle } from "./shared/item-circle-base"
import {
  getCircleColors,
  getItemClickability,
  isItemStartable,
} from "./shared/item-circle-utils"

export type QuizItemCircleProps = {
  categoryId: string
  index: number
  item: { contentType: "quizzes" } & CategoryContentItem
  previousItems: Array<CategoryContentItem>
}

export function QuizItemCircle({
  categoryId,
  index,
  item,
  previousItems,
}: QuizItemCircleProps) {
  const { error } = useToast()
  const router = useRouter()
  const { handleStartQuiz } = useStartQuiz()
  const [isLoading, setIsLoading] = useState(false)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)
  const { setSelectedContent } = useSelectedContent()
  const { t } = useTranslation()

  const getProgressState = (): ProgressState => {
    if (!item.itemProgress) return "locked"
    if (item.itemProgress.status === "completed") return "completed"
    return "started"
  }

  const getProgress = (): number => {
    if (item.itemProgress?.status === "completed") return 100
    if (item.itemProgress && item.content.questionsCount > 0)
      return Math.round(
        (item.itemProgress.completedQuestions / item.content.questionsCount) *
          100,
      )
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

    const response = await handleStartQuiz(categoryId, item.itemId)

    setIsLoading(false)

    if (response._tag === "Failure") {
      if (response.error.code === "max_free_items_reached") {
        setIsVoucherDialogOpen(true)
        return
      }
      error("Failed to start quiz")
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
              <MedalStarIcon />
            </div>
          </div>
        )}
      </BaseItemCircle>
      <VoucherDialog
        categoryId={categoryId}
        description={t("voucher.dialog.description")}
        onOpenChange={setIsVoucherDialogOpen}
        open={isVoucherDialogOpen}
        showFreeTrial={false}
        showTrigger={false}
        title={t("voucher.dialog.title")}
      />
    </>
  )
}
