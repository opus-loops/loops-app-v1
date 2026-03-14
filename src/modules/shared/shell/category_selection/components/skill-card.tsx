import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { ProgressState } from "@/modules/shared/utils/types"

import { cn } from "@/modules/shared/lib/utils"

import { ProgressCircle } from "./progress-circle"

type SkillCardProps = {
  index: number
  item: CategoryContentItem
  progress: number
  progressState: ProgressState
}

export function SkillCard({
  index,
  item,
  progress,
  progressState,
}: SkillCardProps) {
  const { t } = useTranslation()

  return (
    <motion.button
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "w-full rounded-lg bg-[#15153a] p-5 text-left transition-all duration-200",
        progressState !== "locked" && "hover:bg-[#1a1a45]",
        progressState === "locked" && "opacity-60",
      )}
      initial={{ opacity: 0, x: -20 }}
      key={item.categoryItemId}
      transition={{ delay: index * 0.1 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-y-2">
          <span className="text-loops-cyan font-outfit text-xl font-semibold">
            {t("category_details.skill")}
          </span>
          <span className="font-outfit text-loops-light text-sm font-normal">
            {item.content.label[0].content}
          </span>
        </div>

        <div className="flex items-center justify-center">
          <ProgressCircle progress={progress} progressState={progressState} />
        </div>
      </div>
    </motion.button>
  )
}
