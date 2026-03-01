import { DifficultyTag } from "@/modules/shared/components/common/difficulty-tag"
import { ClockIcon } from "@/modules/shared/components/icons/clock"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { cn } from "@/modules/shared/lib/utils"
import { formatTimeDuration } from "@/modules/shared/utils/format-duration"
import { ProgressState } from "@/modules/shared/utils/types"
import { motion } from "framer-motion"
import { ProgressCircle } from "./progress-circle"

type QuizCardProps = {
  item: CategoryContentItem
  index: number
  progressState: ProgressState
  progress: number
}

export function QuizCard({
  item,
  index,
  progressState,
  progress,
}: QuizCardProps) {
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
        <div className="flex-1">
          <div className="mb-3 flex flex-col items-start gap-y-2">
            <span className="font-outfit text-xl font-semibold text-purple-400">
              Quiz
            </span>
            <span className="font-outfit text-loops-light text-sm font-normal">
              {item.content.label[0].content}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded bg-[#0717de] px-2 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {item.contentType === "quizzes" && item.content.questionsCount}{" "}
                Questions
              </span>
            </div>

            {item.contentType === "quizzes" && (
              <DifficultyTag difficulty={item.content.difficulty} />
            )}

            <div className="bg-loops-label-xp rounded px-2 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {item.contentType === "quizzes" && item.content.score}XP
              </span>
            </div>

            <div className="bg-loops-orange flex items-center gap-1 rounded p-2">
              <div className="text-loops-light size-5 shrink-0 grow-0">
                <ClockIcon />
              </div>
              <span className="font-outfit text-loops-light text-xs font-medium">
                {item.contentType === "quizzes" &&
                  formatTimeDuration(item.content.totalTime)}
              </span>
            </div>
          </div>
        </div>

        <div className="ml-4 flex items-center justify-center">
          <ProgressCircle progress={progress} progressState={progressState} />
        </div>
      </div>
    </motion.button>
  )
}
