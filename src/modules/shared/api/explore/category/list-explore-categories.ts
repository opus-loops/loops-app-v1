import { categorySchema } from "@/modules/shared/domain/entities/category"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import type { Effect } from "effect"
import { Schema } from "effect"

const listExploreCategoriesQuerySchema = Schema.Struct({
  query: Schema.optional(Schema.String),
  sort: Schema.optional(Schema.Number.pipe(Schema.int())),
  sortBy: Schema.optional(Schema.String),
  size: Schema.optional(Schema.Number.pipe(Schema.int())),
  offset: Schema.optional(Schema.Number.pipe(Schema.int())),
  page: Schema.optional(Schema.Number.pipe(Schema.int())),
})

export type ListExploreCategoriesQuery =
  typeof listExploreCategoriesQuerySchema.Type

export const listExploreCategoriesErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      query: Schema.optional(Schema.String),
      sort: Schema.optional(Schema.String),
      sortBy: Schema.optional(Schema.String),
      size: Schema.optional(Schema.String),
      offset: Schema.optional(Schema.String),
      page: Schema.optional(Schema.String),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type ListExploreCategoriesErrors =
  typeof listExploreCategoriesErrorsSchema.Type

export const listExploreCategoriesSuccessSchema = Schema.Struct({
  categories: Schema.Array(categorySchema),
  metadata: Schema.Struct({
    query: Schema.optional(Schema.String),
    sort: Schema.Number.pipe(Schema.int()),
    sortBy: Schema.String,
    size: Schema.Number.pipe(Schema.int()),
    offset: Schema.Number.pipe(Schema.int()),
    page: Schema.Number.pipe(Schema.int()),
    total: Schema.Number.pipe(Schema.int()),
    totalPages: Schema.Number.pipe(Schema.int()),
  }),
})

export type ListExploreCategoriesSuccess =
  typeof listExploreCategoriesSuccessSchema.Type

type ListExploreCategoriesResult = Effect.Effect<
  ListExploreCategoriesSuccess,
  ListExploreCategoriesErrors
>

export const listExploreCategoriesExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: listExploreCategoriesErrorsSchema,
  success: listExploreCategoriesSuccessSchema,
})

export const listExploreCategoriesFactory = async () => {
  const instance = await instanceFactory()

  return function listExploreCategories(
    queryParams?: ListExploreCategoriesQuery,
  ): ListExploreCategoriesResult {
    const params = new URLSearchParams()

    if (queryParams?.query) params.append("query", queryParams.query)
    if (queryParams?.sort !== undefined)
      params.append("sort", queryParams.sort.toString())
    if (queryParams?.sortBy) params.append("sortBy", queryParams.sortBy)
    if (queryParams?.size !== undefined)
      params.append("size", queryParams.size.toString())
    if (queryParams?.offset !== undefined)
      params.append("offset", queryParams.offset.toString())
    if (queryParams?.page !== undefined)
      params.append("page", queryParams.page.toString())

    const queryString = params.toString()
    const url = queryString
      ? `/explore/categories?${queryString}`
      : "/explore/categories"

    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "ListExploreCategoriesErrors",
        schema: listExploreCategoriesErrorsSchema,
      },
      name: "ListExploreCategories",
      success: {
        name: "ListExploreCategoriesSuccess",
        schema: listExploreCategoriesSuccessSchema,
      },
    })(response)
  }
}
