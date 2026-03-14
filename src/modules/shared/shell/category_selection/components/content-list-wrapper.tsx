import { useExploreCategory } from "@/modules/content-management/features/content-detail/services/use-explore-category"

import { ContentList } from "./content-list"

type ContentListWrapperProps = {
  categoryId: string
  onBack: () => void
  showBackButton: boolean
}

export function ContentListWrapper({
  categoryId,
  onBack,
  showBackButton,
}: ContentListWrapperProps) {
  const { category } = useExploreCategory({ categoryId })

  return (
    <ContentList
      category={category}
      onBack={onBack}
      showBackButton={showBackButton}
    />
  )
}
