import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { cn } from "@/modules/shared/lib/utils"
import { motion } from "framer-motion"

type CategoryCardProps = {
  category: CategoryWithStartedCategory
  onClick: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const totalItemsCount = category.totalItemsCount
  const progress =
    category.startedCategory !== undefined
      ? Math.round(
          (category.startedCategory.completedItemsCount / totalItemsCount) *
            100,
        )
      : 0

  const imageUrl = category.cover.urls?.[100]

  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl p-4 text-left",
        "transition-all duration-200",
        category.startedCategory !== undefined
          ? "bg-gradient-to-r from-pink-600 to-pink-500"
          : "from-loops-locked-blue bg-gradient-to-r to-slate-900",
        "shadow-lg hover:shadow-xl",
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Category Image/Icon */}
            {imageUrl && (
              <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                <img
                  src={imageUrl}
                  alt={category.cover.alt}
                  title={category.cover.title}
                  aria-description={category.cover.description}
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-outfit text-lg font-semibold text-white">
                {category.name[0].content}
              </h3>
              <p className="font-outfit text-sm text-white/80">
                {totalItemsCount} lessons
              </p>
            </div>
          </div>
        </div>

        {/* Enrollment Status */}
        <div className="flex items-center gap-2">
          {category.startedCategory !== undefined && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 px-3 py-1">
              <span className="font-outfit text-xs font-medium text-white">
                {progress}%
              </span>
            </div>
          )}

          {category.startedCategory === undefined && (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10">
                <div className="text-loops-light/50 size-4 shrink-0 grow-0">
                  <LockIcon />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.button>
  )
}
