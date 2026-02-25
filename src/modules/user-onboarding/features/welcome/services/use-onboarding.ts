import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { OnboardingWire } from "./onboarding-fn"
import { onboardingFn } from "./onboarding-fn"

export function useOnboarding() {
  const onboardingServer = useServerFn(onboardingFn)
  const queryClient = useQueryClient()

  const handleOnboarding = useCallback(
    async (formData: { dailyGoal: string; level: string; status: string }) => {
      const response = (await onboardingServer({
        data: formData,
      })) as OnboardingWire

      if (response._tag === "Success")
        await queryClient.invalidateQueries({
          exact: true,
          queryKey: ["authenticated"],
        })

      return response
    },
    [onboardingServer, queryClient],
  )

  return { handleOnboarding }
}
