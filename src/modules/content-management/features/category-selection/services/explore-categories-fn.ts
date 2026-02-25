import type {
  listExploreCategoriesErrorsSchema,
  listExploreCategoriesSuccessSchema,
} from "@/modules/shared/api/explore/category/list-explore-categories"
import { listExploreCategories } from "@/modules/shared/api/explore/category/list-explore-categories"
import type { getStartedCategoryErrorsSchema } from "@/modules/shared/api/explore/started_category/get-started-category"
import { getStartedCategory } from "@/modules/shared/api/explore/started_category/get-started-category"
import type { Category } from "@/modules/shared/domain/entities/category"
import type { StartedCategory } from "@/modules/shared/domain/entities/started-category"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ExploreCategoriesErrors =
  | typeof unknownErrorSchema.Type
  | typeof listExploreCategoriesErrorsSchema.Type
  | typeof getStartedCategoryErrorsSchema.Type

export type CategoryWithStartedCategory = Category & {
  startedCategory?: StartedCategory
}

export type ExploreCategoriesSuccess = {
  categories: CategoryWithStartedCategory[]
  metadata: (typeof listExploreCategoriesSuccessSchema.Type)["metadata"]
}

// JSON-safe wire union
export type ExploreCategoriesWire =
  | { _tag: "Failure"; error: ExploreCategoriesErrors }
  | { _tag: "Success"; value: ExploreCategoriesSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchExploreCategoriesEffect = () =>
  Effect.gen(function* () {
    // 1) First, fetch all categories
    const categoriesExit = yield* Effect.promise(() =>
      Effect.runPromiseExit(listExploreCategories()),
    )

    if (categoriesExit._tag === "Failure") {
      const failure = Option.getOrElse(
        Cause.failureOption(categoriesExit.cause),
        () => ({
          code: "UnknownError" as const,
          message: "Failed to fetch categories",
        }),
      )
      return yield* Effect.fail(failure)
    }

    const categoriesData = categoriesExit.value
    const categoriesWithStartedData: CategoryWithStartedCategory[] = []

    // 2) For each category, try to fetch its started category data
    for (const category of categoriesData.categories) {
      const startedCategoryExit = yield* Effect.promise(() =>
        Effect.runPromiseExit(
          getStartedCategory({ categoryId: category.categoryId }),
        ),
      )

      let categoryWithStartedData: CategoryWithStartedCategory = { ...category }

      // If started category exists, add it to the category data
      if (startedCategoryExit._tag === "Success") {
        categoryWithStartedData.startedCategory =
          startedCategoryExit.value.startedCategory
      }
      // If it fails with category_not_started, that's expected - category not started yet
      // If it fails with other errors, we still include the category without started data

      categoriesWithStartedData.push(categoryWithStartedData)
    }

    // 3) Sort categories: started categories first, then by updatedAt descending
    const sortedCategories = categoriesWithStartedData.sort((a, b) => {
      // If one has startedCategory and the other doesn't, prioritize the one with startedCategory
      if (a.startedCategory && !b.startedCategory) return -1
      if (!a.startedCategory && b.startedCategory) return 1

      // If both have startedCategory, sort by updatedAt descending (most recent first)
      if (a.startedCategory && b.startedCategory) {
        return (
          b.startedCategory.updatedAt.getTime() -
          a.startedCategory.updatedAt.getTime()
        )
      }

      // If neither has startedCategory, maintain original order
      return 0
    })

    // 4) Return success with sorted data
    const successValue: ExploreCategoriesSuccess = {
      categories: sortedCategories,
      metadata: categoriesData.metadata,
    }

    return successValue
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const exploreCategoriesFn = createServerFn({
  method: "GET",
}).handler(async (): Promise<ExploreCategoriesWire> => {
  // 1) Run your Effect on the server
  const exit = await Effect.runPromiseExit(fetchExploreCategoriesEffect())

  // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
  let wire: ExploreCategoriesWire
  if (exit._tag === "Success") {
    wire = { _tag: "Success", value: exit.value }
  } else {
    const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
      // Fallback if you sometimes throw defects: map to a typed error variant in your union
      return {
        code: "UnknownError" as const,
        message: "Unexpected error occurred while fetching explore categories",
      }
    })
    wire = { _tag: "Failure", error: failure }
  }

  // 3) Return JSON-serializable value (Start will serialize it)
  return wire
})
