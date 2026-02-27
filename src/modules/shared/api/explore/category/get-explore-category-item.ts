import { categoryItemSchema } from "@/modules/shared/domain/entities/category-item"
import { categoryItemNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-item-not-found"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getExploreCategoryItemArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  itemId: Schema.String,
})

type GetExploreCategoryItemArgs = typeof getExploreCategoryItemArgsSchema.Type

export const getExploreCategoryItemErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      itemId: Schema.optional(Schema.String),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryItemNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetExploreCategoryItemErrors =
  typeof getExploreCategoryItemErrorsSchema.Type

export const getExploreCategoryItemSuccessSchema = Schema.Struct({
  categoryItem: categoryItemSchema,
})

export type GetExploreCategoryItemSuccess =
  typeof getExploreCategoryItemSuccessSchema.Type

type GetExploreCategoryItemResult = Effect.Effect<
  GetExploreCategoryItemSuccess,
  GetExploreCategoryItemErrors
>

export const getExploreCategoryItemExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreCategoryItemErrorsSchema,
  success: getExploreCategoryItemSuccessSchema,
})

export type GetExploreCategoryItemExit =
  typeof getExploreCategoryItemExitSchema.Type

export const getExploreCategoryItemFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreCategoryItem(
    args: GetExploreCategoryItemArgs,
  ): GetExploreCategoryItemResult {
    const parsedArgs = parseEffectSchema(getExploreCategoryItemArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/items/${parsedArgs.itemId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreCategoryItemErrors",
        schema: getExploreCategoryItemErrorsSchema,
      },
      name: "GetExploreCategoryItem",
      success: {
        name: "GetExploreCategoryItemSuccess",
        schema: getExploreCategoryItemSuccessSchema,
      },
    })(response)
  }
}
