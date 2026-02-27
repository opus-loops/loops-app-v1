import type { getExploreCategoryErrorsSchema } from "@/modules/shared/api/explore/category/get-explore-category"
import { getExploreCategoryFactory } from "@/modules/shared/api/explore/category/get-explore-category"
import type { getStartedCategoryErrorsSchema } from "@/modules/shared/api/explore/started_category/get-started-category"
import { getStartedCategoryFactory } from "@/modules/shared/api/explore/started_category/get-started-category"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
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
  | { code: "Unauthorized" }

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
  Effect.gen(function* (_) {
    const { categoryId } = params

    // 1) First, fetch the category
    const getExploreCategory = yield* _(
      Effect.promise(() => getExploreCategoryFactory()),
    )

    const categoryExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(getExploreCategory({ categoryId })),
      ),
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
    const getStartedCategory = yield* _(
      Effect.promise(() => getStartedCategoryFactory()),
    )

    const startedCategoryExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(getStartedCategory({ categoryId })),
      ),
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
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

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
