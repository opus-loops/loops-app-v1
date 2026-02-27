import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ProgressState } from "@/modules/shared/utils/types"
import { CircleColors } from "./item-circle-base"

export const getCircleColors = (
  progressState: ProgressState,
  isFirstItem: boolean,
): CircleColors => {
  if (progressState === "completed")
    return {
      outer: "bg-green-500",
      inner: "bg-green-600",
      progress: "stroke-green-400",
      text: "text-white",
    }

  if (isFirstItem && progressState === "locked")
    return {
      outer: "bg-pink-500",
      inner: "bg-pink-600",
      progress: "stroke-pink-400",
      text: "text-white",
    }

  if (progressState === "started")
    return {
      outer: "bg-blue-500",
      inner: "bg-blue-600",
      progress: "stroke-cyan-400",
      text: "text-white",
    }

  return {
    outer: "bg-white/20",
    inner: "bg-white/10",
    progress: "stroke-white/30",
    text: "text-white/70",
  }
}

export const isItemStartable = (
  index: number,
  previousItems: Array<CategoryContentItem>,
): boolean => {
  // First item is always startable
  if (index === 0) return true

  // Check if all previous items are completed
  return previousItems.every((prevItem) => {
    if (prevItem.contentType === "skills")
      return prevItem.itemProgress?.isCompleted === true
    return prevItem.itemProgress?.status === "completed"
  })
}

export const getItemClickability = (
  progressState: ProgressState,
  isStartable: boolean,
): boolean =>
  progressState === "completed" || progressState === "started" || isStartable
