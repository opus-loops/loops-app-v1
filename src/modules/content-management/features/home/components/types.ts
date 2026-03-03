import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

export type CategoryItemProps = {
  categoryId: string
  index: number
  item: CategoryContentItem
  previousItems: Array<CategoryContentItem>
}

export type CategoryMappingProps = {
  categoryId: string
  categoryItems: Array<CategoryContentItem>
}
