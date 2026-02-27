import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const onboardingArgsSchema = Schema.Struct({
  background: Schema.String,
  codingExperience: Schema.String,
  duration: Schema.Number.pipe(Schema.int()),
})

type OnboardingArgs = typeof onboardingArgsSchema.Type

export const onboardingErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      background: Schema.optional(Schema.String),
      codingExperience: Schema.optional(Schema.String),
      duration: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
    }),
  ),
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type OnboardingErrors = typeof onboardingErrorsSchema.Type

export const onboardingSuccessSchema = successMessageSchema

type OnboardingResult = Effect.Effect<OnboardingSuccess, OnboardingErrors>
type OnboardingSuccess = typeof onboardingSuccessSchema.Type

export const onboardingExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: onboardingErrorsSchema,
  success: onboardingSuccessSchema,
})

export const onboardingFactory = async () => {
  const instance = await instanceFactory()

  return function onboarding(args: OnboardingArgs): OnboardingResult {
    const parsedArgs = parseEffectSchema(onboardingArgsSchema, args)
    const response = instance.patch("/profile/onboarding", parsedArgs)

    return parseApiResponse({
      error: {
        name: "OnboardingErrors",
        schema: onboardingErrorsSchema,
      },
      name: "Onboarding",
      success: {
        name: "OnboardingSuccess",
        schema: onboardingSuccessSchema,
      },
    })(response)
  }
}
