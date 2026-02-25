import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { useVirtualizer } from "@tanstack/react-virtual"
import { motion } from "framer-motion"
import { useRef } from "react"
import { BackButton } from "./back-button"
import { CategoryCard } from "./category-card"

type CategoriesListProps = {
  categories: Array<CategoryWithStartedCategory>
  onCategorySelect: (category: CategoryWithStartedCategory) => void
  onBack: () => void
  showBackButton: boolean
}

export function CategoriesList({
  onCategorySelect,
  categories,
  onBack,
  showBackButton,
}: CategoriesListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: categories.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 136,
  })

  const items = virtualizer.getVirtualItems()
  const startOfFirstItem = items[0]?.start ?? 0
  const totalSize = virtualizer.getTotalSize()

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          All categories
        </h1>
      </div>

      {/* Virtualized List */}
      <div
        ref={parentRef}
        className="flex-1 overflow-auto px-4"
        style={{ contain: "strict" }}
      >
        <div style={{ height: totalSize, width: "100%", position: "relative" }}>
          <motion.div
            style={{ position: "absolute", top: 0, left: 0, width: "100%" }}
            animate={{ y: startOfFirstItem }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
              mass: 0.8,
            }}
          >
            {items.map((virtualItem) => {
              const category = categories[virtualItem.index]
              return (
                <motion.div
                  key={virtualItem.key}
                  data-index={virtualItem.index}
                  ref={virtualizer.measureElement}
                  initial={{ opacity: 0, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: virtualItem.index * 0.05 }}
                  className="mb-3"
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
                      onClick={() => onCategorySelect(category)}
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
