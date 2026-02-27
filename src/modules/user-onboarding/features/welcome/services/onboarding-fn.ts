import type {
  onboardingErrorsSchema,
  onboardingSuccessSchema,
} from "@/modules/shared/api/profile/update-onboarding"
import { onboardingFactory } from "@/modules/shared/api/profile/update-onboarding"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type OnboardingErrors =
  | typeof unknownErrorSchema.Type
  | typeof onboardingErrorsSchema.Type
  | { code: "Unauthorized" }

export type OnboardingSuccess = typeof onboardingSuccessSchema.Type

// JSON-safe wire union
export type OnboardingWire =
  | { _tag: "Failure"; error: OnboardingErrors }
  | { _tag: "Success"; value: OnboardingSuccess }

// Helper function to convert form values to API format
function convertFormToApiData(formData: {
  dailyGoal: string
  level: string
  status: string
}) {
  // Convert dailyGoal string to duration in minutes
  const durationMap: Record<string, number> = {
    "10min": 10,
    "15min": 15,
    "20min": 20,
    "5min": 5,
  }

  return {
    background: formData.status,
    codingExperience: formData.level,
    duration: durationMap[formData.dailyGoal] || 10,
  }
}

// --- SERVER FUNCTION ---------------------------------------------------------
export const onboardingFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly dailyGoal: string
        readonly level: string
        readonly status: string
      },
  )
  .handler(async (ctx) => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Convert form data to API format
    const apiData = convertFormToApiData(ctx.data)

    // 2) Run your Effect on the server
    const onboarding = await onboardingFactory()
    const exit = await Effect.runPromiseExit(onboarding(apiData))

    // 3) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: OnboardingWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 4) Return JSON-serializable value (Start will serialize it)
    return wire
  })
