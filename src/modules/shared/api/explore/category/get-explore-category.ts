import type { Effect } from "effect"

import { Schema } from "effect"

import { categorySchema } from "@/modules/shared/domain/entities/category"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getExploreCategoryArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type GetExploreCategoryArgs = typeof getExploreCategoryArgsSchema.Type

export const getExploreCategoryErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
)

export type GetExploreCategoryErrors =
  typeof getExploreCategoryErrorsSchema.Type

export const getExploreCategorySuccessSchema = Schema.Struct({
  category: Schema.NullOr(categorySchema),
})

export type GetExploreCategorySuccess =
  typeof getExploreCategorySuccessSchema.Type

type GetExploreCategoryResult = Effect.Effect<
  GetExploreCategorySuccess,
  GetExploreCategoryErrors
>

export const getExploreCategoryExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreCategoryErrorsSchema,
  success: getExploreCategorySuccessSchema,
})

export const getExploreCategoryFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreCategory(
    args: GetExploreCategoryArgs,
  ): GetExploreCategoryResult {
    const parsedArgs = parseEffectSchema(getExploreCategoryArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreCategoryErrors",
        schema: getExploreCategoryErrorsSchema,
      },
      name: "GetExploreCategory",
      success: {
        name: "GetExploreCategorySuccess",
        schema: getExploreCategorySuccessSchema,
      },
    })(response)
  }
}
