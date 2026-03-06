import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useRequestConfirm } from "./use-request-confirm"

type RequestConfirmCodeProps = {
  handleCodeExpirationChange: (seconds: number) => void
}

export function RequestConfirmCode({
  handleCodeExpirationChange,
}: RequestConfirmCodeProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { handleRequestConfirm } = useRequestConfirm()
  const { error, success } = useToast()
  const { t } = useTranslation()

  const handleResendCode = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const response = await handleRequestConfirm()
    setIsSubmitting(false)

    if (response._tag === "Success") {
      const remainingSeconds =
        Math.floor(response.value.payload.expiresAt.getTime() / 1000) -
        Math.floor(Date.now() / 1000)

      handleCodeExpirationChange(remainingSeconds)
      success(t("auth.verify.resend_success"), {
        description: t("auth.verify.resend_success_desc"),
      })
    } else
      error(t("auth.verify.resend_error"), {
        description: t("auth.verify.resend_error_desc"),
      })
  }

  return (
    <div className="flex flex-col items-center gap-y-4">
      <p className="font-outfit text-loops-cyan text-center text-base font-medium">
        {t("auth.verify.resend_title")}
      </p>
      <Button
        className="font-outfit bg-loops-white text-loops-text hover:bg-loops-white/90 w-full rounded-xl py-7 text-lg leading-5 font-semibold shadow-none"
        disabled={isSubmitting}
        onClick={handleResendCode}
        type="button"
      >
        {isSubmitting
          ? t("auth.verify.resend_loading")
          : t("auth.verify.resend_button")}
      </Button>
    </div>
  )
}
