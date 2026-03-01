import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { cn } from "@/modules/shared/lib/utils"
import { ProgressState } from "@/modules/shared/utils/types"
import { motion } from "framer-motion"
import { ProgressCircle } from "./progress-circle"

type SkillCardProps = {
  item: CategoryContentItem
  index: number
  progressState: ProgressState
  progress: number
}

export function SkillCard({
  item,
  index,
  progressState,
  progress,
}: SkillCardProps) {
  return (
    <motion.button
      key={item.categoryItemId}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "w-full rounded-lg bg-[#15153a] p-5 text-left transition-all duration-200",
        progressState !== "locked" && "hover:bg-[#1a1a45]",
        progressState === "locked" && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-y-2">
          <span className="text-loops-cyan font-outfit text-xl font-semibold">
            Skill
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
