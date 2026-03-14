import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import type { User } from "@/modules/shared/domain/entities/user"

import { useExploreCategory } from "@/modules/content-management/features/content-detail/services/use-explore-category"

import { CategoryDetails } from "./category-details"

type CategoryDetailsWrapperProps = {
  categoryId: string
  onBack: () => void
  onViewAll: (category: CategoryWithStartedCategory) => void
  showBackButton: boolean
  user: User
}

export function CategoryDetailsWrapper({
  categoryId,
  onBack,
  onViewAll,
  showBackButton,
  user,
}: CategoryDetailsWrapperProps) {
  const { category } = useExploreCategory({ categoryId })

  return (
    <CategoryDetails
      category={category}
      onBack={onBack}
      onViewAll={() => onViewAll(category)}
      showBackButton={showBackButton}
      user={user}
    />
  )
}
