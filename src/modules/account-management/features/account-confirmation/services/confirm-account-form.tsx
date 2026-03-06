import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { RequestConfirmCode } from "@/modules/account-management/features/verification/services/request-confirm-code"
import { CodeInputGroup } from "@/modules/shared/components/common/code-input-group"
import { CountdownTimer } from "@/modules/shared/components/common/countdown-timer"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { Button } from "@/modules/shared/components/ui/button"
import { Label } from "@/modules/shared/components/ui/label"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useConfirmAccount } from "./use-confirm-account"

export function ConfirmAccountForm() {
  const { handleConfirmAccount } = useConfirmAccount()
  const { error: toastError } = useToast()
  const [timeLeft, setTimeLeft] = useState<null | number>(null)
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      confirmationCode: "",
    },
    onSubmit: async ({ value, formApi }) => {
      if (!formApi.state.canSubmit) return

      const confirmationCode = parseInt(value.confirmationCode, 10)
      const response = await handleConfirmAccount(confirmationCode)

      if (response._tag === "Failure") {
        if (response.error.code === "invalid_input") {
          form.setFieldMeta("confirmationCode", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.verify.invalid_code") },
            errors: [t("auth.verify.invalid_code")],
          }))
          return
        }
        if (response.error.code === "invalid_expired_code") {
          form.setFieldMeta("confirmationCode", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.verify.expired_code") },
            errors: [t("auth.verify.expired_code")],
          }))
          return
        }

        toastError(t("auth.verify.failed"), {
          description: t("auth.verify.unexpected_error"),
        })
      }
    },
  })

  return (
    <div className="mx-auto w-full max-w-md">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <form.Field name="confirmationCode">
          {(field) => (
            <div className="space-y-2">
              <Label htmlFor={field.name}>{t("auth.verify.label_code")}</Label>
              <CodeInputGroup
                length={5}
                onChange={(value) => field.handleChange(value)}
              />
              {field.state.meta.isTouched && !field.state.meta.isValid ? (
                <div className="flex w-full items-center gap-x-1">
                  <div className="text-loops-wrong size-4 shrink-0 grow-0">
                    <DangerIcon />
                  </div>
                  <p className="text-loops-wrong font-outfit text-sm leading-5">
                    {field.state.meta.errors.join(", ")}
                  </p>
                </div>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
              disabled={!canSubmit}
              type="submit"
            >
              {isSubmitting
                ? t("auth.verify.submitting")
                : t("auth.verify.submit")}
            </Button>
          )}
        </form.Subscribe>

        <div className="text-center">
          {/* Timer */}
          {timeLeft && (
            <div className="flex justify-center">
              <CountdownTimer
                initialSeconds={timeLeft}
                isActive={timeLeft > 0}
                onExpire={() => {
                  setTimeLeft(0)
                }}
              />
            </div>
          )}

          {/* Resend Section */}
          <RequestConfirmCode
            handleCodeExpirationChange={(leftTime) => {
              setTimeLeft(leftTime)
            }}
          />
        </div>
      </form>
    </div>
  )
}
