import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"
import { BackButton } from "./back-button"
import { CategoryActionButton } from "./category-action-button"
import { CategoryItemCard } from "./category-item-card"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"
import { DifficultyTag } from "@/modules/shared/components/common/difficulty-tag"
import { CodeCircleIcon } from "@/modules/shared/components/icons/code-circle"
import { DocumentCopyIcon } from "@/modules/shared/components/icons/document-copy"

type CategoryDetailsProps = {
  category: CategoryWithStartedCategory
  onBack: () => void
  onViewAll: () => void
  showBackButton: boolean
  user: User
}

export function CategoryDetails({
  category,
  onBack,
  onViewAll,
  showBackButton,
  user,
}: CategoryDetailsProps) {
  const { t } = useTranslation()
  const { categoryItems } = useCategoryContent({
    categoryId: category.categoryId,
    size: 3,
  })

  const imageUrl = category.cover.urls?.[20]

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          {t("category_details.title")}
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {imageUrl && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl">
              <img
                alt={category.cover.alt}
                aria-description={category.cover.description}
                className="h-full w-full object-cover"
                src={imageUrl}
                title={category.cover.title}
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          )}

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#de08a891]">
              <div className="text-loops-light h-8 w-8 shrink-0 grow-0">
                <CodeCircleIcon />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-outfit text-loops-light mb-1 text-xl font-bold">
                {category.name[0].content}
              </h3>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-loops-label-skill rounded px-2 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {category.skillCount} {t("category_details.skills")}
              </span>
            </div>
            <div className="rounded bg-[#0717de] px-2 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {category.quizCount} {t("category_details.quizzes")}
              </span>
            </div>
            <DifficultyTag difficulty={category.difficulty} />
            <div className="rounded bg-[#ffc120] px-2 py-1">
              <span className="font-outfit text-loops-light text-xs font-medium">
                {category.totalXP}
                {t("category_details.xp")}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="font-outfit text-loops-light text-base leading-relaxed">
            {category.description[0].content}
          </p>

          {/* Content Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="text-loops-light h-6 w-6 shrink-0 grow-0">
                <DocumentCopyIcon />
              </div>
              <h4 className="font-outfit text-loops-light flex-1 text-xl font-bold">
                {t("category_details.content_list_title")}
              </h4>
              <button
                className="font-outfit hover:text-loops-light text-sm font-medium text-[#eff1f5] transition-colors"
                onClick={onViewAll}
              >
                {t("category_details.view_all")}
              </button>
            </div>

            {/* Content Items */}
            <div className="space-y-4">
              {categoryItems.map((item, index) => (
                <CategoryItemCard
                  index={index}
                  item={item}
                  key={item.categoryItemId}
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
        animate={{ opacity: 1, y: 0 }}
        className="bg-loops-background fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 py-4 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <CategoryActionButton category={category} user={user} />
      </motion.div>
    </div>
  )
}
