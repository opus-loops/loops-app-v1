import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { previousItemNotCompletedErrorSchema } from "@/modules/shared/domain/errors/previous-item-not-completed"
import { skillAlreadyStartedErrorSchema } from "@/modules/shared/domain/errors/skill-already-started"
import { skillNotFoundErrorSchema } from "@/modules/shared/domain/errors/skill-not-found"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const startSkillArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  skillId: Schema.String,
})

type StartSkillArgs = typeof startSkillArgsSchema.Type

export const startSkillErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      skillId: Schema.optional(Schema.String),
    }),
  ),
  skillAlreadyStartedErrorSchema,
  previousItemNotCompletedErrorSchema,
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  skillNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type StartSkillErrors = typeof startSkillErrorsSchema.Type

export const startSkillSuccessSchema = successMessageSchema

export type StartSkillSuccess = typeof startSkillSuccessSchema.Type

type StartSkillResult = Effect.Effect<StartSkillSuccess, StartSkillErrors>

export const startSkillExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: startSkillErrorsSchema,
  success: startSkillSuccessSchema,
})

export const startSkillFactory = async () => {
  const instance = await instanceFactory()

  return function startSkill(args: StartSkillArgs): StartSkillResult {
    const parsedArgs = parseEffectSchema(startSkillArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/skills/${parsedArgs.skillId}/started`
    const response = instance.post(url)

    return parseApiResponse({
      error: {
        name: "StartSkillErrors",
        schema: startSkillErrorsSchema,
      },
      name: "StartSkill",
      success: {
        name: "StartSkillSuccess",
        schema: startSkillSuccessSchema,
      },
    })(response)
  }
}
