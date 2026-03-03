import { useMemo } from "react"

import { CategoryItemCircle } from "./category-item-circle"
import type { CategoryMappingProps } from "./types"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

export function CategoryMapping({
  categoryId,
  categoryItems,
}: CategoryMappingProps) {
  const renderRow = (params: {
    items: Array<CategoryContentItem>
    rowIndex: number
  }) => {
    const isOddRow = params.rowIndex % 2 === 0

    if (isOddRow) {
      const itemIndex = categoryItems.indexOf(params.items[0])
      const previousItems = categoryItems.slice(0, itemIndex)

      return (
        <div className="flex justify-center" key={`row-${params.rowIndex}`}>
          <CategoryItemCircle
            categoryId={categoryId}
            index={itemIndex}
            item={params.items[0]}
            previousItems={previousItems}
          />
        </div>
      )
    }

    return (
      <div className="flex justify-center gap-8" key={`row-${params.rowIndex}`}>
        {params.items.map((item, itemIndex) => {
          const globalIndex = categoryItems.indexOf(item)
          const previousItems = categoryItems.slice(0, globalIndex)

          return (
            <CategoryItemCircle
              categoryId={categoryId}
              index={globalIndex}
              item={item}
              key={`row-${params.rowIndex}-column-${itemIndex}`}
              previousItems={previousItems}
            />
          )
        })}
      </div>
    )
  }

  const rows = useMemo(() => {
    const getRowIndex = (itemIndex: number) => {
      let rowIndex = 0
      let processedItems = 0

      while (processedItems <= itemIndex) {
        const isOddRow = rowIndex % 2 === 0
        const itemsInThisRow = isOddRow ? 1 : 2
        if (processedItems + itemsInThisRow > itemIndex) return rowIndex
        processedItems += itemsInThisRow
        rowIndex++
      }

      return rowIndex
    }

    return categoryItems.reduce(
      (acc, item, index) => {
        const rowIndex = getRowIndex(index)

        if (!acc[rowIndex]) acc[rowIndex] = []
        acc[rowIndex] = [...acc[rowIndex], item]

        return acc
      },
      [] as Array<Array<CategoryContentItem>>,
    )
  }, [categoryItems])

  // TODO: use tanstack virtual here

  return (
    <div className="mb-24 flex flex-col items-center gap-y-6">
      {rows.map((rowItems, rowIndex) =>
        renderRow({ items: rowItems, rowIndex }),
      )}
    </div>
  )
}
