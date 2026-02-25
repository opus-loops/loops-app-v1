import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { useExploreCategory } from "@/modules/content-management/features/content-detail/services/use-explore-category"
import type { User } from "@/modules/shared/domain/entities/user"
import { CategoryDetails } from "./category-details"

type CategoryDetailsWrapperProps = {
  categoryId: string
  user: User
  onBack: () => void
  showBackButton: boolean
  onViewAll: (category: CategoryWithStartedCategory) => void
}

export function CategoryDetailsWrapper({
  categoryId,
  user,
  onViewAll,
  onBack,
  showBackButton,
}: CategoryDetailsWrapperProps) {
  const { category } = useExploreCategory({ categoryId })

  return (
    <CategoryDetails
      category={category}
      user={user}
      onViewAll={() => onViewAll(category)}
      onBack={onBack}
      showBackButton={showBackButton}
    />
  )
}
