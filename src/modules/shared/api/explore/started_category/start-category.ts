import type { Effect } from "effect"
import { Schema } from "effect"

import { categoryAlreadyStartedErrorSchema } from "@/modules/shared/domain/errors/category-already-started"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotPublicErrorSchema } from "@/modules/shared/domain/errors/category-not-public"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successResponseWithPayloadSchemaFactory } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const startCategoryArgsSchema = Schema.Struct({
  categoryId: Schema.String,
})

type StartCategoryArgs = typeof startCategoryArgsSchema.Type

export const startCategoryErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  categoryNotPublicErrorSchema,
  categoryAlreadyStartedErrorSchema,
  categoryNotFoundErrorSchema,
  userNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type StartCategoryErrors = typeof startCategoryErrorsSchema.Type

export const startCategorySuccessSchema =
  successResponseWithPayloadSchemaFactory(
    Schema.Struct({
      categoryId: Schema.String,
      userId: Schema.String,
    }),
  )

export type StartCategorySuccess = typeof startCategorySuccessSchema.Type

type StartCategoryResult = Effect.Effect<
  StartCategorySuccess,
  StartCategoryErrors
>

export const startCategoryExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: startCategoryErrorsSchema,
  success: startCategorySuccessSchema,
})

export const startCategoryFactory = async () => {
  const instance = await instanceFactory()

  return function startCategory(args: StartCategoryArgs): StartCategoryResult {
    const parsedArgs = parseEffectSchema(startCategoryArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/started`
    const response = instance.post(url)

    return parseApiResponse({
      error: {
        name: "StartCategoryErrors",
        schema: startCategoryErrorsSchema,
      },
      name: "StartCategory",
      success: {
        name: "StartCategorySuccess",
        schema: startCategorySuccessSchema,
      },
    })(response)
  }
}
