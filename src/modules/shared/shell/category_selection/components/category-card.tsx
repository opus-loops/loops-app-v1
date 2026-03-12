import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"

import { LockIcon } from "@/modules/shared/components/icons/lock"
import { cn } from "@/modules/shared/lib/utils"

type CategoryCardProps = {
  category: CategoryWithStartedCategory
  onClick: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const { t } = useTranslation()
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
      disabled={!category.isPublic}
      className={cn(
        "relative w-full overflow-hidden rounded-2xl p-4 text-left",
        "transition-all duration-200",
        category.startedCategory !== undefined
          ? "bg-gradient-to-r from-pink-600 to-pink-500"
          : "from-loops-locked-blue bg-gradient-to-r to-slate-900",
        category.isPublic
          ? "shadow-lg hover:shadow-xl"
          : "cursor-not-allowed opacity-60 grayscale",
      )}
      onClick={onClick}
    >
      {!category.isPublic && (
        <div className="font-outfit absolute top-0 right-0 z-20 rounded-bl-xl bg-yellow-400 px-3 py-1 text-xs font-bold text-black shadow-md">
          {t("common.coming_soon")}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {/* Category Image/Icon */}
            {imageUrl && (
              <div className="bg-loops-light/20 flex h-20 w-20 items-center justify-center rounded-lg backdrop-blur-sm">
                <img
                  alt={category.cover.alt}
                  aria-description={category.cover.description}
                  className="h-full w-full rounded-lg object-cover"
                  src={imageUrl}
                  title={category.cover.title}
                />
              </div>
            )}

            <div className="flex-1">
              <h3 className="font-outfit text-loops-light text-lg font-semibold">
                {category.name[0].content}
              </h3>
              <p className="font-outfit text-loops-light/80 text-sm">
                {totalItemsCount} {t("categories_list.lessons")}
              </p>
            </div>
          </div>
        </div>

        {/* Enrollment Status */}
        <div className="flex items-center gap-2">
          {category.startedCategory !== undefined && (
            <div className="bg-loops-light/20 flex h-10 w-10 items-center justify-center rounded-full px-3 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {progress}%
              </span>
            </div>
          )}

          {category.startedCategory === undefined && (
            <div className="bg-loops-light/20 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm">
              <div className="bg-loops-light/10 flex h-7 w-7 items-center justify-center rounded-full">
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
