import { useVirtualizer } from "@tanstack/react-virtual"
import { motion } from "framer-motion"
import { useRef } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { BackButton } from "./back-button"
import { CategoryCard } from "./category-card"

type CategoriesListProps = {
  categories: Array<CategoryWithStartedCategory>
  onBack: () => void
  onCategorySelect: (category: CategoryWithStartedCategory) => void
  showBackButton: boolean
}

export function CategoriesList({
  categories,
  onBack,
  onCategorySelect,
  showBackButton,
}: CategoriesListProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()

  const virtualizer = useVirtualizer({
    count: categories.length,
    estimateSize: () => 136,
    getScrollElement: () => parentRef.current,
  })

  const items = virtualizer.getVirtualItems()
  const startOfFirstItem = items[0]?.start ?? 0
  const totalSize = virtualizer.getTotalSize()

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          {t("categories_list.title")}
        </h1>
      </div>

      {/* Virtualized List */}
      <div
        className="flex-1 overflow-auto px-4"
        ref={parentRef}
        style={{ contain: "strict" }}
      >
        <div style={{ height: totalSize, position: "relative", width: "100%" }}>
          <motion.div
            animate={{ y: startOfFirstItem }}
            style={{ left: 0, position: "absolute", top: 0, width: "100%" }}
            transition={{
              damping: 40,
              mass: 0.8,
              stiffness: 400,
              type: "spring",
            }}
          >
            {items.map((virtualItem) => {
              const category = categories[virtualItem.index]
              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3"
                  data-index={virtualItem.index}
                  initial={{ opacity: 0, y: 0 }}
                  key={virtualItem.key}
                  ref={virtualizer.measureElement}
                  transition={{ delay: virtualItem.index * 0.05 }}
                >
                  <div className="flex w-full items-center gap-x-2">
                    {category.startedCategory !== undefined && (
                      <div className="flex h-full w-auto flex-col items-center gap-y-1">
                        <div className="h-5 w-0.5 rounded-xl bg-gradient-to-b from-pink-600 to-pink-500"></div>
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-b from-pink-600/50 to-pink-500/50">
                          <div className="h-2 w-2 rounded-full bg-gradient-to-b from-pink-600/70 to-pink-500/70"></div>
                        </div>
                        <div className="h-5 w-0.5 rounded-xl bg-gradient-to-b from-pink-600 to-pink-500"></div>
                      </div>
                    )}

                    {category.startedCategory === undefined && (
                      <div className="flex h-full w-auto flex-col items-center gap-y-1">
                        <div className="bg-loops-light/50 h-5 w-0.5 rounded-xl"></div>
                        <div className="text-loops-light/50 size-6 shrink-0 grow-0">
                          <LockIcon />
                        </div>
                        <div className="bg-loops-light/50 h-5 w-0.5 rounded-xl"></div>
                      </div>
                    )}

                    <CategoryCard
                      category={category}
                      onClick={() => {
                        if (category.isPublic) {
                          onCategorySelect(category)
                        }
                      }}
                    />
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
