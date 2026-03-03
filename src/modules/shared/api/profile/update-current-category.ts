import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const updateCurrentCategoryArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type UpdateCurrentCategoryArgs = typeof updateCurrentCategoryArgsSchema.Type

export const updateCurrentCategoryErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(UseCaseErrorSchema),
      categoryId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  categoryNotStartedErrorSchema,
  categoryNotFoundErrorSchema,
  userNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type UpdateCurrentCategoryErrors =
  typeof updateCurrentCategoryErrorsSchema.Type

export type UpdateCurrentCategorySuccess = typeof successResponseSchema.Type

type UpdateCurrentCategoryResult = Effect.Effect<
  UpdateCurrentCategorySuccess,
  UpdateCurrentCategoryErrors
>

export const updateCurrentCategoryFactory = async () => {
  const instance = await instanceFactory()

  return function updateCurrentCategory(
    args: UpdateCurrentCategoryArgs,
  ): UpdateCurrentCategoryResult {
    const parsedArgs = parseEffectSchema(updateCurrentCategoryArgsSchema, args)
    const response = instance.patch("/profile/current_category", parsedArgs)

    return parseApiResponse({
      error: {
        name: "UpdateCurrentCategoryErrors",
        schema: updateCurrentCategoryErrorsSchema,
      },
      name: "UpdateCurrentCategory",
      success: {
        name: "UpdateCurrentCategorySuccess",
        schema: successResponseSchema,
      },
    })(response)
  }
}
