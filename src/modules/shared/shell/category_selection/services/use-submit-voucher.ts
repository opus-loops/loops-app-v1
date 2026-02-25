import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { SubmitVoucherWire } from "./submit-voucher-fn"
import { submitVoucherFn } from "./submit-voucher-fn"

export function useSubmitVoucher() {
  const submitVoucherServer = useServerFn(submitVoucherFn)
  const queryClient = useQueryClient()

  const handleSubmitVoucher = useCallback(
    async (categoryId: string, code: number) => {
      // Call server function → returns JSON-safe union
      const response = (await submitVoucherServer({
        data: { categoryId, code },
      })) as SubmitVoucherWire

      // If successful, invalidate authenticated queries to refresh user data
      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })
      }

      return response
    },
    [submitVoucherServer, queryClient],
  )

  return {
    handleSubmitVoucher,
  }
}
