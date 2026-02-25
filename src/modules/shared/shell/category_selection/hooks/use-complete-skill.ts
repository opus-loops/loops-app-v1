import type { CompleteSkillWire } from "@/modules/shared/shell/category_selection/services/complete-skill-fn"
import { completeSkillFn } from "@/modules/shared/shell/category_selection/services/complete-skill-fn"
import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

export function useCompleteSkill() {
  const queryClient = useQueryClient()
  const completeSkillServer = useServerFn(completeSkillFn)

  const handleCompleteSkill = useCallback(
    async ({
      categoryId,
      skillId,
    }: {
      categoryId: string
      skillId: string
    }) => {
      // Call server function → returns JSON-safe union
      const response = (await completeSkillServer({
        data: { categoryId, skillId },
      })) as CompleteSkillWire

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["single-category-item", categoryId, skillId],
        })
      }

      return response
    },
    [completeSkillServer],
  )

  return { handleCompleteSkill }
}
