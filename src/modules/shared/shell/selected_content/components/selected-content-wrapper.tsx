import { useEffect } from "react"

import { SelectedContentScreen } from "./selected-content-screen"
import { useSingleCategoryItem } from "@/modules/content-management/features/single-item/services/use-single-category-item"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"

type SelectedContentWrapperProps = {
  categoryId: string
  contentId: string
}

export function SelectedContentWrapper({
  categoryId,
  contentId,
}: SelectedContentWrapperProps) {
  const { setSelectedContent } = useSelectedContent()
  const { categoryItem } = useSingleCategoryItem({
    categoryId,
    itemId: contentId,
  })

  useEffect(() => {
    setSelectedContent(categoryItem)
  }, [categoryItem])

  return <SelectedContentScreen selectedItem={categoryItem} />
}
