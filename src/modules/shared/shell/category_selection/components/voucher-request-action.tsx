import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

import { useSubmitVoucherRequest } from "../services/use-submit-voucher-request"

type VoucherRequestActionProps = {
  categoryId: string
}

export function VoucherRequestAction({
  categoryId,
}: VoucherRequestActionProps) {
  const { t } = useTranslation()
  const { error, success } = useToast()
  const { handleSubmitVoucherRequest } = useSubmitVoucherRequest()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const requestVoucher = async () => {
    setIsSubmitting(true)
    const response = await handleSubmitVoucherRequest(categoryId)
    setIsSubmitting(false)

    if (response._tag === "Failure") {
      if (response.error.code === "voucher_request_already_pending") {
        error(t("voucher.request.errors.already_pending"))
        return
      }

      error(t("voucher.request.errors.submit_failed"))
      return
    }

    success(t("voucher.request.success.submitted"))
  }

  return (
    <Button
      className="font-outfit text-loops-light border-loops-light/20 mt-2 w-full rounded-xl border-2 bg-transparent py-6 text-base leading-5 font-semibold capitalize transition-all duration-200"
      disabled={isSubmitting}
      onClick={() => requestVoucher()}
      type="button"
      variant="outline"
    >
      {isSubmitting
        ? t("voucher.form.submitting")
        : t("voucher.request.selection_cta")}
    </Button>
  )
}
