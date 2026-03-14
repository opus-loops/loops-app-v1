import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { QuizItemCircle } from "./quiz-item-circle"
import { SkillItemCircle } from "./skill-item-circle"

export type CategoryItemProps = {
  categoryId: string
  index: number
  item: CategoryContentItem
  previousItems: Array<CategoryContentItem>
}

export function CategoryItemCircle({
  categoryId,
  index,
  item,
  previousItems,
}: CategoryItemProps) {
  if (item.contentType === "quizzes")
    return (
      <QuizItemCircle
        categoryId={categoryId}
        index={index}
        item={item}
        previousItems={previousItems}
      />
    )

  return (
    <SkillItemCircle
      categoryId={categoryId}
      index={index}
      item={item}
      previousItems={previousItems}
    />
  )
}
