import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"
import { DifficultyTag } from "@/modules/shared/components/common/difficulty-tag"
import { CodeCircleIcon } from "@/modules/shared/components/icons/code-circle"
import { DocumentCopyIcon } from "@/modules/shared/components/icons/document-copy"
import type { User } from "@/modules/shared/domain/entities/user"
import { motion } from "framer-motion"
import { BackButton } from "./back-button"
import { CategoryActionButton } from "./category-action-button"
import { CategoryItemCard } from "./category-item-card"

type CategoryDetailsProps = {
  category: CategoryWithStartedCategory
  user: User
  onViewAll: () => void
  onBack: () => void
  showBackButton: boolean
}

export function CategoryDetails({
  category,
  user,
  onViewAll,
  onBack,
  showBackButton,
}: CategoryDetailsProps) {
  const { categoryItems } = useCategoryContent({
    categoryId: category.categoryId,
    size: 3,
  })

  const imageUrl = category.cover.urls?.[100]

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          Category details
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {imageUrl && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={category.cover.alt}
                title={category.cover.title}
                aria-description={category.cover.description}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#de08a891]">
              <div className="h-8 w-8 shrink-0 grow-0 text-white">
                <CodeCircleIcon />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-outfit mb-1 text-xl font-bold text-white">
                {category.name[0].content}
              </h3>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-loops-label-skill rounded px-2 py-1">
              <span className="font-outfit text-xs font-medium text-white">
                {category.skillCount} Skills
              </span>
            </div>
            <div className="rounded bg-[#0717de] px-2 py-1">
              <span className="font-outfit text-xs font-medium text-white">
                {category.quizCount} Quizzes
              </span>
            </div>
            <DifficultyTag difficulty={category.difficulty} />
            <div className="rounded bg-[#ffc120] px-2 py-1">
              <span className="font-outfit text-xs font-medium text-white">
                {category.totalXP}XP
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-outfit text-base leading-relaxed text-white">
            {category.description[0].content}
          </p>

          {/* Content Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 shrink-0 grow-0 text-white">
                <DocumentCopyIcon />
              </div>
              <h4 className="font-outfit flex-1 text-xl font-bold text-white">
                Content
              </h4>
              <button
                onClick={onViewAll}
                className="font-outfit text-sm font-medium text-[#eff1f5] transition-colors hover:text-white"
              >
                View all
              </button>
            </div>

            {/* Content Items */}
            <div className="space-y-4">
              {categoryItems.map((item, index) => (
                <CategoryItemCard
                  key={item.categoryItemId}
                  item={item}
                  index={index}
                />
              ))}
            </div>
          </div>

          {/* Bottom padding to prevent content from being obscured by sticky button */}
          <div className="h-24" />
        </motion.div>
      </div>

      {/* Sticky Button Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-loops-background fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 py-4 shadow-lg"
      >
        <CategoryActionButton category={category} user={user} />
      </motion.div>
    </div>
  )
}
