import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"
import { useCallPathSegment } from "@/modules/shared/telemetry/use-call-path-segment"

import { getVoucherRequestFn } from "./get-voucher-request-fn"

interface VoucherRequestParams {
  categoryId: string
}

export const voucherRequestQuery = (
  params: VoucherRequestParams,
  handleSessionExpired: () => Promise<void>,
) =>
  queryOptions({
    queryFn: async () => {
      const response = await getVoucherRequestFn({
        data: { categoryId: params.categoryId },
      })

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") await handleSessionExpired()
        if (response.error.code === "voucher_request_not_found") return null
        throw new Error("Failed to fetch voucher request")
      }

      return response.value.payload
    },
    queryKey: ["voucher-request", params.categoryId],
  })

export function useGetVoucherRequest(params: VoucherRequestParams) {
  useCallPathSegment("hook", "useGetVoucherRequest")

  const { handleSessionExpired } = useGlobalError()
  const { data: voucherRequest } = useSuspenseQuery(
    voucherRequestQuery(params, handleSessionExpired),
  )
  return { voucherRequest }
}
