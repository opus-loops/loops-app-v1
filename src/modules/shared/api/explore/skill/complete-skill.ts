import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { skillAlreadyCompletedErrorSchema } from "@/modules/shared/domain/errors/skill-already-completed"
import { skillNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const completeSkillArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  skillId: Schema.String,
})

type CompleteSkillArgs = typeof completeSkillArgsSchema.Type

export const completeSkillErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      skillId: Schema.optional(Schema.String),
    }),
  ),
  skillAlreadyCompletedErrorSchema,
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  skillNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type CompleteSkillErrors = typeof completeSkillErrorsSchema.Type

export const completeSkillSuccessSchema = successMessageSchema

export type CompleteSkillSuccess = typeof completeSkillSuccessSchema.Type

type CompleteSkillResult = Effect.Effect<
  CompleteSkillSuccess,
  CompleteSkillErrors
>

export const completeSkillExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: completeSkillErrorsSchema,
  success: completeSkillSuccessSchema,
})

export const completeSkillFactory = async () => {
  const instance = await instanceFactory()

  return function completeSkill(args: CompleteSkillArgs): CompleteSkillResult {
    const parsedArgs = parseEffectSchema(completeSkillArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/skills/${parsedArgs.skillId}/completed`
    const response = instance.post(url)

    return parseApiResponse({
      error: {
        name: "CompleteSkillErrors",
        schema: completeSkillErrorsSchema,
      },
      name: "CompleteSkill",
      success: {
        name: "CompleteSkillSuccess",
        schema: completeSkillSuccessSchema,
      },
    })(response)
  }
}
