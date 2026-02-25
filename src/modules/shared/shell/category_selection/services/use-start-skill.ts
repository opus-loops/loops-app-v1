import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { StartSkillWire } from "./start-skill-fn"
import { startSkillFn } from "./start-skill-fn"

export function useStartSkill() {
  const startSkillServer = useServerFn(startSkillFn)
  const queryClient = useQueryClient()

  const handleStartSkill = useCallback(
    async (params: { categoryId: string; skillId: string }) => {
      // Call server function → returns JSON-safe union
      const response = (await startSkillServer({
        data: { categoryId: params.categoryId, skillId: params.skillId },
      })) as StartSkillWire

      // If successful, invalidate relevant queries to refresh data
      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["single-category-item", params.categoryId, params.skillId],
        })
      }

      return response
    },
    [startSkillServer, queryClient],
  )

  return { handleStartSkill }
}
