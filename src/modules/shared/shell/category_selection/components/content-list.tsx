import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"

import { BackButton } from "./back-button"
import { CategoryItemCard } from "./category-item-card"
import type { Variants } from "framer-motion"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"

import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"

type ContentListProps = {
  category: CategoryWithStartedCategory
  onBack: () => void
  showBackButton: boolean
}

export function ContentList({
  category,
  onBack,
  showBackButton,
}: ContentListProps) {
  const { t } = useTranslation()
  const { categoryItems } = useCategoryContent({
    categoryId: category.categoryId,
  })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 30,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        damping: 15,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        stiffness: 100,
        type: "spring",
      },
      y: 0,
    },
  }

  // TODO: use tanstack virtual here

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="relative flex items-center justify-center px-4 py-6"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          {t("content_list.title")}
        </h1>
      </motion.div>

      {/* Content Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <motion.div
          animate="visible"
          className="space-y-4"
          initial="hidden"
          variants={containerVariants}
        >
          {categoryItems.map((item, index) => (
            <motion.div
              key={`${item.itemType}-${item.itemId}`}
              variants={cardVariants}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              whileTap={{
                scale: 0.98,
                transition: { duration: 0.1, ease: "easeInOut" },
              }}
            >
              <CategoryItemCard index={index} item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
