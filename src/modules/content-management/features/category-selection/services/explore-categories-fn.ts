import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  listExploreCategoriesErrorsSchema,
  listExploreCategoriesSuccessSchema,
} from "@/modules/shared/api/explore/category/list-explore-categories"
import type { getStartedCategoryErrorsSchema } from "@/modules/shared/api/explore/started_category/get-started-category"
import type { Category } from "@/modules/shared/domain/entities/category"
import type { Certificate } from "@/modules/shared/domain/entities/certificate"
import type { StartedCategory } from "@/modules/shared/domain/entities/started-category"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { listExploreCategoriesFactory } from "@/modules/shared/api/explore/category/list-explore-categories"
import { getCertificateFactory } from "@/modules/shared/api/explore/certificate/get-certificate"
import { getStartedCategoryFactory } from "@/modules/shared/api/explore/started_category/get-started-category"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type CategoryWithStartedCategory = {
  certificate?: Certificate
  startedCategory?: StartedCategory
} & Category

// --- TYPES (pure TS) ---------------------------------------------------------
export type ExploreCategoriesErrors =
  | { code: "Unauthorized" }
  | typeof getStartedCategoryErrorsSchema.Type
  | typeof listExploreCategoriesErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type ExploreCategoriesSuccess = {
  categories: Array<CategoryWithStartedCategory>
  metadata: (typeof listExploreCategoriesSuccessSchema.Type)["metadata"]
}

// JSON-safe wire union
export type ExploreCategoriesWire =
  | { _tag: "Failure"; error: ExploreCategoriesErrors }
  | { _tag: "Success"; value: ExploreCategoriesSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchExploreCategoriesEffect = () =>
  Effect.gen(function* (_) {
    // 1) First, fetch all categories
    const listExploreCategories = yield* _(
      Effect.promise(() => listExploreCategoriesFactory()),
    )

    const categoriesExit = yield* _(
      Effect.promise(() => Effect.runPromiseExit(listExploreCategories())),
    )

    if (categoriesExit._tag === "Failure") {
      const failure = handleServerFnFailure(categoriesExit.cause)
      return yield* Effect.fail(failure as ExploreCategoriesErrors)
    }

    const categoriesData = categoriesExit.value
    const categoriesWithStartedData: Array<CategoryWithStartedCategory> = []

    // 2) For each category, try to fetch its started category data
    for (const category of categoriesData.categories) {
      const getStartedCategory = yield* _(
        Effect.promise(() => getStartedCategoryFactory()),
      )

      const startedCategoryExit = yield* _(
        Effect.promise(() =>
          Effect.runPromiseExit(
            getStartedCategory({ categoryId: category.categoryId }),
          ),
        ),
      )

      const categoryWithStartedData: CategoryWithStartedCategory = {
        ...category,
      }

      // If started category exists, add it to the category data
      if (startedCategoryExit._tag === "Success") {
        categoryWithStartedData.startedCategory =
          startedCategoryExit.value.startedCategory

        const getCertificate = yield* _(
          Effect.promise(() => getCertificateFactory()),
        )

        const certificateExit = yield* _(
          Effect.promise(() =>
            Effect.runPromiseExit(
              getCertificate({ categoryId: category.categoryId }),
            ),
          ),
        )

        if (certificateExit._tag === "Success") {
          categoryWithStartedData.certificate =
            certificateExit.value.certificate
        }
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
  const getLoggedUser = await getLoggedUserFactory()
  const userExit = await Effect.runPromiseExit(getLoggedUser())
  const isAuthenticated = userExit._tag === "Success"

  if (!isAuthenticated)
    return {
      _tag: "Failure",
      error: { code: "Unauthorized" as const },
    }

  // 1) Run your Effect on the server
  const exit = await Effect.runPromiseExit(fetchExploreCategoriesEffect())

  // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
  let wire: ExploreCategoriesWire
  if (exit._tag === "Success") {
    wire = { _tag: "Success", value: exit.value }
  } else {
    const failure = handleServerFnFailure(exit.cause)
    wire = { _tag: "Failure", error: failure as ExploreCategoriesErrors }
  }

  // 3) Return JSON-serializable value (Start will serialize it)
  return wire
})
