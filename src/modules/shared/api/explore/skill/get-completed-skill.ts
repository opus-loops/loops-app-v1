import type { Effect } from "effect"

import { Schema } from "effect"

import { completedSkillSchema } from "@/modules/shared/domain/entities/completed-skill"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { skillNotCompletedErrorSchema } from "@/modules/shared/domain/errors/skill-not-completed"
import { skillNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

const getCompletedSkillArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  skillId: Schema.String,
})

type GetCompletedSkillArgs = typeof getCompletedSkillArgsSchema.Type

export const getCompletedSkillErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      skillId: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  skillNotCompletedErrorSchema,
  categoryNotStartedErrorSchema,
  skillNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  categoryNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetStartedSkillErrors = typeof getCompletedSkillErrorsSchema.Type

export const getCompletedSkillSuccessSchema = Schema.Struct({
  completedSkill: completedSkillSchema,
})

export type GetCompletedSkillSuccess =
  typeof getCompletedSkillSuccessSchema.Type

type GetCompletedSkillResult = Effect.Effect<
  GetCompletedSkillSuccess,
  GetStartedSkillErrors
>

export const getCompletedSkillExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getCompletedSkillErrorsSchema,
  success: getCompletedSkillSuccessSchema,
})

export const getCompletedSkillFactory = async () => {
  const instance = await instanceFactory()

  return function getCompletedSkill(
    args: GetCompletedSkillArgs,
  ): GetCompletedSkillResult {
    const parsedArgs = parseEffectSchema(getCompletedSkillArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/skills/${parsedArgs.skillId}/completed`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetStartedSkillErrors",
        schema: getCompletedSkillErrorsSchema,
      },
      name: "GetCompletedSkill",
      success: {
        name: "GetCompletedSkillSuccess",
        schema: getCompletedSkillSuccessSchema,
      },
    })(response)
  }
}
