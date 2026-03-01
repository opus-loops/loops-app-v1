import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import {
  updatePreferencesFn,
  type UpdatePreferencesFnArgs,
} from "../services/update-preferences-fn"

export function useUpdatePreferences() {
  const runUpdatePreferences = useServerFn(updatePreferencesFn)
  const queryClient = useQueryClient()

  const handleUpdatePreferences = useCallback(
    async (args: UpdatePreferencesFnArgs) => {
      const response = await runUpdatePreferences({
        data: args,
      })

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({ queryKey: ["authenticated"] })
      }

      return response
    },
    [runUpdatePreferences, queryClient],
  )

  return { handleUpdatePreferences }
}
