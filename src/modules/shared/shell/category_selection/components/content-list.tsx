import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { useCategoryContent } from "@/modules/content-management/features/content-list/services/use-category-content"
import { motion, Variants } from "framer-motion"
import { BackButton } from "./back-button"
import { CategoryItemCard } from "./category-item-card"

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
  const { categoryItems } = useCategoryContent({
    categoryId: category.categoryId,
  })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  // TODO: use tanstack virtual here

  return (
    <div className="flex h-full flex-col">
      {/* Header Section */}
      <motion.div
        className="relative flex items-center justify-center px-4 py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {showBackButton && <BackButton onBack={onBack} />}

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          Content list
        </h1>
      </motion.div>

      {/* Content Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
        <motion.div
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
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
              <CategoryItemCard item={item} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
