import { skillSchema } from "@/modules/shared/domain/entities/skill"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { skillNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getExploreSkillArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  skillId: Schema.String,
})

type GetExploreSkillArgs = typeof getExploreSkillArgsSchema.Type

export const getExploreSkillErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      skillId: Schema.optional(Schema.String),
    }),
  ),
  skillNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  categoryNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetExploreSkillErrors = typeof getExploreSkillErrorsSchema.Type

export const getExploreSkillSuccessSchema = Schema.Struct({
  skill: skillSchema,
})

export type GetExploreSkillSuccess = typeof getExploreSkillSuccessSchema.Type

type GetExploreSkillResult = Effect.Effect<
  GetExploreSkillSuccess,
  GetExploreSkillErrors
>

export const getExploreSkillExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreSkillErrorsSchema,
  success: getExploreSkillSuccessSchema,
})

export const getExploreSkillFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreSkill(
    args: GetExploreSkillArgs,
  ): GetExploreSkillResult {
    const parsedArgs = parseEffectSchema(getExploreSkillArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/skills/${parsedArgs.skillId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreSkillErrors",
        schema: getExploreSkillErrorsSchema,
      },
      name: "GetExploreSkill",
      success: {
        name: "GetExploreSkillSuccess",
        schema: getExploreSkillSuccessSchema,
      },
    })(response)
  }
}
