import type { getExploreCategoryErrorsSchema } from "@/modules/shared/api/explore/category/get-explore-category"
import { getExploreCategory } from "@/modules/shared/api/explore/category/get-explore-category"
import type { getStartedCategoryErrorsSchema } from "@/modules/shared/api/explore/started_category/get-started-category"
import { getStartedCategory } from "@/modules/shared/api/explore/started_category/get-started-category"
import type { Category } from "@/modules/shared/domain/entities/category"
import type { StartedCategory } from "@/modules/shared/domain/entities/started-category"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ExploreCategoryErrors =
  | typeof unknownErrorSchema.Type
  | typeof getExploreCategoryErrorsSchema.Type
  | typeof getStartedCategoryErrorsSchema.Type

export type CategoryWithStartedCategory = Category & {
  startedCategory?: StartedCategory
}

export type ExploreCategorySuccess = {
  category: CategoryWithStartedCategory
}

export type ExploreCategoryParams = {
  categoryId: string
}

// JSON-safe wire union
export type ExploreCategoryWire =
  | { _tag: "Failure"; error: ExploreCategoryErrors }
  | { _tag: "Success"; value: ExploreCategorySuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchExploreCategoryEffect = (params: ExploreCategoryParams) =>
  Effect.gen(function* () {
    const { categoryId } = params

    // 1) First, fetch the category
    const categoryExit = yield* Effect.promise(() =>
      Effect.runPromiseExit(getExploreCategory({ categoryId })),
    )

    if (categoryExit._tag === "Failure") {
      const failure = Option.getOrElse(
        Cause.failureOption(categoryExit.cause),
        () => ({
          code: "UnknownError" as const,
          message: "Failed to fetch category",
        }),
      )
      return yield* Effect.fail(failure)
    }

    const { category } = categoryExit.value
    let categoryWithStartedData: CategoryWithStartedCategory = { ...category }

    // 2) Try to fetch the started category data
    const startedCategoryExit = yield* Effect.promise(() =>
      Effect.runPromiseExit(getStartedCategory({ categoryId })),
    )

    // If started category exists, add it to the category data
    if (startedCategoryExit._tag === "Success") {
      categoryWithStartedData.startedCategory =
        startedCategoryExit.value.startedCategory
    }

    // If it fails with category_not_started, that's expected - category not started yet
    // If it fails with other errors, we still include the category without started data

    return { category: categoryWithStartedData }
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const exploreCategoryFn = createServerFn({ method: "GET" })
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
      },
  )
  .handler(async (ctx): Promise<ExploreCategoryWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchExploreCategoryEffect(ctx.data),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ExploreCategoryWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error occurred while fetching explore category",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
