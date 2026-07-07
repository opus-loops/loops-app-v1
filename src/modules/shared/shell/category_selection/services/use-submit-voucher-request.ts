import { useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { useGlobalError } from "../../session/global-error-provider"
import { submitVoucherRequestFn } from "./submit-voucher-request-fn"

export function useSubmitVoucherRequest() {
  const submitVoucherRequestServer = useServerFn(submitVoucherRequestFn)
  const { handleSessionExpired } = useGlobalError()
  const queryClient = useQueryClient()

  const handleSubmitVoucherRequest = useCallback(
    async (categoryId: string) => {
      const response = await submitVoucherRequestServer({
        data: { categoryId },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          await handleSessionExpired()
        }
      }

      if (response._tag === "Success") {
        await queryClient.invalidateQueries({
          queryKey: ["voucher-request", categoryId],
        })
      }

      return response
    },
    [submitVoucherRequestServer, queryClient, handleSessionExpired],
  )

  return { handleSubmitVoucherRequest }
}
