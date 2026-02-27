import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"
import type { SubmitVoucherWire } from "./submit-voucher-fn"
import { submitVoucherFn } from "./submit-voucher-fn"

export function useSubmitVoucher() {
  const submitVoucherServer = useServerFn(submitVoucherFn)
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleSubmitVoucher = useCallback(
    async (categoryId: string, code: number) => {
      const response = (await submitVoucherServer({
        data: { categoryId, code },
      })) as SubmitVoucherWire

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["authenticated"],
        })

        await router.navigate({ to: "/", search: {} })
      }

      return response
    },
    [submitVoucherServer, queryClient],
  )

  return {
    handleSubmitVoucher,
  }
}
