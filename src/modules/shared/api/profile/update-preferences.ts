import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { takenUsernameErrorSchema } from "@/modules/shared/domain/errors/taken-username"
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

export const updatePreferencesErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      fullName: Schema.optional(UseCaseErrorSchema),
      avatarURL: Schema.optional(UseCaseErrorSchema),
      username: Schema.optional(UseCaseErrorSchema),
      birthDate: Schema.optional(UseCaseErrorSchema),
      gender: Schema.optional(UseCaseErrorSchema),
      duration: Schema.optional(UseCaseErrorSchema),
      country: Schema.optional(UseCaseErrorSchema),
      state: Schema.optional(UseCaseErrorSchema),
      city: Schema.optional(UseCaseErrorSchema),
      phoneNumber: Schema.optional(UseCaseErrorSchema),
      authorization: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
      language: Schema.optional(UseCaseErrorSchema),
      interests: Schema.optional(UseCaseErrorSchema),
      codingExperience: Schema.optional(UseCaseErrorSchema),
      goals: Schema.optional(UseCaseErrorSchema),
      background: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  takenUsernameErrorSchema,
  userNotFoundErrorSchema,
  invalidExpiredTokenErrorSchema,
)

export type UpdatePreferencesErrors = typeof updatePreferencesErrorsSchema.Type

export const updatePreferencesSuccessSchema = successResponseSchema

type UpdatePreferencesResult = Effect.Effect<
  UpdatePreferencesSuccess,
  UpdatePreferencesErrors
>
type UpdatePreferencesSuccess = typeof updatePreferencesSuccessSchema.Type

const updatePreferencesArgsSchema = Schema.Struct({
  fullName: Schema.optional(Schema.String),
  avatarURL: Schema.optional(Schema.String),
  username: Schema.optional(Schema.String),
  language: Schema.optional(Schema.Literal("en", "fr", "ar")),
  birthDate: Schema.optional(Schema.DateFromString),
  gender: Schema.optional(Schema.String),
  background: Schema.optional(Schema.String),
  codingExperience: Schema.optional(Schema.String),
  interests: Schema.optional(Schema.String),
  duration: Schema.optional(Schema.Number),
  goals: Schema.optional(Schema.String),
  country: Schema.optional(Schema.String),
  state: Schema.optional(Schema.String),
  city: Schema.optional(Schema.String),
  phoneNumber: Schema.optional(Schema.String),
})

export type UpdatePreferencesArgs = typeof updatePreferencesArgsSchema.Type

export const updatePreferencesFactory = async () => {
  const instance = await instanceFactory()

  return function updatePreferences(
    args: UpdatePreferencesArgs,
  ): UpdatePreferencesResult {
    const parsedArgs = parseEffectSchema(updatePreferencesArgsSchema, args)
    const response = instance.put("/profile", parsedArgs)

    return parseApiResponse({
      error: {
        name: "UpdatePreferencesErrors",
        schema: updatePreferencesErrorsSchema,
      },
      name: "UpdatePreferences",
      success: {
        name: "UpdatePreferencesSuccess",
        schema: updatePreferencesSuccessSchema,
      },
    })(response)
  }
}
