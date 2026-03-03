import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "../../session/global-error-provider"
import { submitVoucherFn } from "./submit-voucher-fn"
import type { SubmitVoucherWire } from "./submit-voucher-fn"

export function useSubmitVoucher() {
  const submitVoucherServer = useServerFn(submitVoucherFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleSubmitVoucher = useCallback(
    async (categoryId: string, code: number) => {
      const response = await submitVoucherServer({
        data: { categoryId, code },
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

        await router.navigate({ search: {}, to: "/" })
      }

      return response
    },
    [submitVoucherServer, queryClient, handleSessionExpired],
  )

  return {
    handleSubmitVoucher,
  }
}
