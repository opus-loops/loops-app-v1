import type * as React from "react"

import { AlertCircle } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useRequestResetPassword } from "@/modules/authentication/features/reset-password/services/use-request-reset-password"
import { CodeInputGroup } from "@/modules/shared/components/common/code-input-group"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

type ResetPasswordCodeStepProps = {
  errors: Array<string>
  handleSubmitVerificationCode: () => void
  isTouched: boolean
  onChange: (value: string) => void
  resetPasswordEmail: string
}

export function ResetPasswordCodeStep({
  errors,
  handleSubmitVerificationCode,
  isTouched,
  onChange,
  resetPasswordEmail,
}: ResetPasswordCodeStepProps) {
  const { t } = useTranslation()
  const [isResendingCode, setIsResendingCode] = useState(false)
  const { handleRequestResetPassword } = useRequestResetPassword()
  const { error, success } = useToast()

  const handleResendCode = async () => {
    if (isResendingCode) return

    setIsResendingCode(true)
    const response = await handleRequestResetPassword(resetPasswordEmail)

    if (response._tag === "Failure") {
      error(t("auth.reset_password.request_failed"), {
        description: t("auth.reset_password.request_failed_description"),
      })
      return response
    }

    success(t("auth.reset_password.request_success"), {
      description: t("auth.reset_password.request_success_description"),
    })
  }

  return (
    <div className="flex w-full flex-col items-start gap-y-8">
      <div className="flex w-full flex-col items-start gap-y-4">
        <h2 className="font-outfit text-loops-pink text-center text-3xl leading-5 font-bold tracking-tight wrap-break-word">
          {t("auth.reset_password.code_title")}
        </h2>
        <p className="font-outfit text-loops-light text-sm leading-6 font-medium">
          {t("auth.reset_password.code_description")}
        </p>
      </div>

      <div className="mx-auto w-full max-w-md">
        <div className="space-y-4">
          <div className="space-y-4">
            <CodeInputGroup length={5} onChange={onChange} />
            <p className="font-outfit text-loops-purple text-center text-sm leading-6 font-medium">
              {t("auth.reset_password.code_hint")}
            </p>

            {isTouched && errors.length > 0 && (
              <div className="flex w-full items-center gap-x-1">
                <div className="text-loops-wrong size-4 shrink-0 grow-0">
                  <DangerIcon />
                </div>
                <p
                  className="text-loops-wrong font-outfit text-sm leading-5"
                  role="alert"
                >
                  {errors.join(", ")}
                </p>
              </div>
            )}
          </div>

          <Button
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
            disabled={isResendingCode}
            onClick={handleSubmitVerificationCode}
            type="button"
          >
            {t("common.continue")}
          </Button>

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center sm:items-start sm:text-left">
            <p className="font-outfit text-loops-light text-sm leading-6 font-medium">
              {t("auth.reset_password.no_code_received")}
            </p>

            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button
                className="font-outfit border-loops-cyan text-loops-cyan hover:bg-loops-cyan/10 hover:text-loops-cyan min-h-11 flex-1 rounded-xl border-2 bg-transparent px-4 text-sm font-semibold shadow-none"
                disabled={isResendingCode}
                onClick={handleResendCode}
                type="button"
                variant="outline"
              >
                {isResendingCode
                  ? t("auth.reset_password.resend_loading")
                  : t("auth.reset_password.resend_code")}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <AlertCircle className="text-loops-warning mt-0.5 size-5 shrink-0" />
            <p className="font-outfit text-loops-warning text-left text-sm leading-6 font-medium">
              {t("auth.reset_password.important_note")}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
