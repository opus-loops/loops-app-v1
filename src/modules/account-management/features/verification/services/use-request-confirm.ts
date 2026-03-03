import { useServerFn } from "@tanstack/react-start"
import { useCallback } from "react"

import { requestConfirmFn } from "./request-confirm-fn"
import type { RequestConfirmWire } from "./request-confirm-fn"
import { useGlobalError } from "@/modules/shared/shell/session/global-error-provider"

// src/features/request_confirm/use-request-confirm.ts

export function useRequestConfirm() {
  const requestConfirmServer = useServerFn(requestConfirmFn)
  const { handleSessionExpired } = useGlobalError()

  const handleRequestConfirm = useCallback(async () => {
    // Call server function → returns JSON-safe union
    const response = await requestConfirmServer()

    if (response._tag === "Failure") {
      if (response.error.code === "Unauthorized") {
        await handleSessionExpired()
      }
    }

    // No runtime decode on client. If you still want runtime checks,
    // you can add a tiny inline type guard here.
    return response
  }, [requestConfirmServer])

  return { handleRequestConfirm }
}
