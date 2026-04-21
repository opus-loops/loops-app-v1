import type { Effect } from "effect"

import { Schema } from "effect"

import { startedCategorySchema } from "@/modules/shared/domain/entities/started-category"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getStartedCategoryArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type GetStartedCategoryArgs = typeof getStartedCategoryArgsSchema.Type

export const getStartedCategoryErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  invalidExpiredTokenErrorSchema,
)

export type GetStartedCategoryErrors =
  typeof getStartedCategoryErrorsSchema.Type

export const getStartedCategorySuccessSchema = Schema.Struct({
  startedCategory: Schema.NullOr(startedCategorySchema),
})

type GetStartedCategoryResult = Effect.Effect<
  GetStartedCategorySuccess,
  GetStartedCategoryErrors
>
type GetStartedCategorySuccess = typeof getStartedCategorySuccessSchema.Type

export const getStartedCategoryExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getStartedCategoryErrorsSchema,
  success: getStartedCategorySuccessSchema,
})

export const getStartedCategoryFactory = async () => {
  const instance = await instanceFactory()

  return function getStartedCategory(
    args: GetStartedCategoryArgs,
  ): GetStartedCategoryResult {
    const parsedArgs = parseEffectSchema(getStartedCategoryArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/started`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetStartedCategoryErrors",
        schema: getStartedCategoryErrorsSchema,
      },
      name: "GetStartedCategory",
      success: {
        name: "GetStartedCategorySuccess",
        schema: getStartedCategorySuccessSchema,
      },
    })(response)
  }
}
