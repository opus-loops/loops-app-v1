import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

import type { UpdatePreferencesFnArgs } from "../services/update-preferences-fn"

import { updatePreferencesFn } from "../services/update-preferences-fn"

export function useUpdatePreferences() {
  const runUpdatePreferences = useServerFn(updatePreferencesFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()

  const handleUpdatePreferences = useCallback(
    async (args: UpdatePreferencesFnArgs) => {
      const response = await runUpdatePreferences({
        data: args,
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })
      }

      return response
    },
    [runUpdatePreferences, queryClient, handleSessionExpired],
  )

  return { handleUpdatePreferences }
}
