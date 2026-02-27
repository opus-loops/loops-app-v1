import { skillContentSchema } from "@/modules/shared/domain/entities/skill-content"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { skillContentNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-content-not-found"
import { skillNotCompletedErrorSchema } from "@/modules/shared/domain/errors/skill-not-completed"
import { skillNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getExploreSkillContentArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  skillId: Schema.String,
})

type GetExploreSkillContentArgs = typeof getExploreSkillContentArgsSchema.Type

export const getExploreSkillContentErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      skillId: Schema.optional(Schema.String),
    }),
  ),
  skillContentNotFoundErrorSchema,
  skillNotCompletedErrorSchema,
  categoryNotStartedErrorSchema,
  skillNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  categoryNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetExploreSkillContentErrors =
  typeof getExploreSkillContentErrorsSchema.Type

export const getExploreSkillContentSuccessSchema = Schema.Struct({
  skillContent: skillContentSchema,
})

export type GetExploreSkillContentSuccess =
  typeof getExploreSkillContentSuccessSchema.Type

type GetExploreSkillContentResult = Effect.Effect<
  GetExploreSkillContentSuccess,
  GetExploreSkillContentErrors
>

export const getExploreSkillContentExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreSkillContentErrorsSchema,
  success: getExploreSkillContentSuccessSchema,
})

export const getExploreSkillContentFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreSkillContent(
    args: GetExploreSkillContentArgs,
  ): GetExploreSkillContentResult {
    const parsedArgs = parseEffectSchema(getExploreSkillContentArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/skills/${parsedArgs.skillId}/content`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreSkillContentErrors",
        schema: getExploreSkillContentErrorsSchema,
      },
      name: "GetExploreSkillContent",
      success: {
        name: "GetExploreSkillContentSuccess",
        schema: getExploreSkillContentSuccessSchema,
      },
    })(response)
  }
}
