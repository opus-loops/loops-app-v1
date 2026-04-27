import { useForm } from "@tanstack/react-form"
import { AlertCircle } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { useRequestConfirm } from "@/modules/account-management/features/verification/services/use-request-confirm"
import { CodeInputGroup } from "@/modules/shared/components/common/code-input-group"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { cn } from "@/modules/shared/lib/utils"

import { useConfirmAccount } from "./use-confirm-account"

const confirmationCodeExpirationSessionPrefix =
  "loops-confirmation-code-expiration"

type ConfirmAccountFormProps = {
  onSuccess?: () => void
  userId: string
}

export function ConfirmAccountForm({
  onSuccess,
  userId,
}: ConfirmAccountFormProps) {
  const { handleConfirmAccount } = useConfirmAccount()
  const { handleRequestConfirm } = useRequestConfirm()
  const { error: toastError, success: toastSuccess } = useToast()
  const [isRequestingCode, setIsRequestingCode] = useState(false)
  const [timeLeft, setTimeLeft] = useState<null | number>(() =>
    readStoredTimeLeft(userId),
  )
  const [hasResendTimer, setHasResendTimer] = useState(() => timeLeft !== null)
  const { t } = useTranslation()

  const expirationKey = useMemo(
    () => getConfirmationCodeExpirationKey(userId),
    [userId],
  )

  const persistTimeLeft = useCallback(
    (nextTimeLeft: null | number) => {
      setTimeLeft(nextTimeLeft)

      if (nextTimeLeft === null || nextTimeLeft <= 0) {
        window.sessionStorage.removeItem(expirationKey)
        return
      }

      window.sessionStorage.setItem(
        expirationKey,
        String(Date.now() + nextTimeLeft * 1000),
      )
    },
    [expirationKey],
  )

  const requestConfirmationCode = useCallback(
    async ({ shouldToast }: { shouldToast: boolean }) => {
      if (isRequestingCode) return

      setIsRequestingCode(true)
      const response = await handleRequestConfirm()
      setIsRequestingCode(false)

      if (response._tag === "Success") {
        const remainingSeconds = getRemainingSecondsFromExpiresAt(
          response.value.payload.expiresAt,
        )

        persistTimeLeft(remainingSeconds || null)
        setHasResendTimer(true)

        if (shouldToast) {
          toastSuccess(t("auth.verify.resend_success"), {
            description: t("auth.verify.resend_success_desc"),
          })
        }

        return
      }

      if (shouldToast) {
        toastError(t("auth.verify.resend_error"), {
          description: t("auth.verify.resend_error_desc"),
        })
      }
    },
    [
      handleRequestConfirm,
      isRequestingCode,
      persistTimeLeft,
      t,
      toastError,
      toastSuccess,
    ],
  )

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return

    const interval = window.setInterval(() => {
      persistTimeLeft(readStoredTimeLeft(userId))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [persistTimeLeft, timeLeft, userId])

  const form = useForm({
    defaultValues: {
      confirmationCode: "",
    },
    onSubmit: async ({ formApi, value }) => {
      if (!formApi.state.isSubmitting) return

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

        return
      }

      onSuccess?.()
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
            <div className="space-y-4">
              <CodeInputGroup
                length={5}
                onChange={(value) => field.handleChange(value)}
              />
              <p className="font-outfit text-loops-purple text-center text-sm leading-6 font-medium">
                {t("auth.verify.input_hint")}
              </p>
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

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button
              className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
              disabled={isSubmitting || isRequestingCode}
              type="submit"
            >
              {isSubmitting
                ? t("auth.verify.submitting")
                : t("auth.verify.submit")}
            </Button>
          )}
        </form.Subscribe>

        {shouldShowExpirationTimer({ hasResendTimer, timeLeft }) ? (
          <div className="flex items-center justify-center gap-2 text-center text-sm leading-6">
            <span className="font-outfit text-loops-light font-medium">
              {t("auth.verify.expiration_timer", {
                minutes: getRemainingMinutes(timeLeft as number),
              })}
            </span>
            <span className="font-outfit text-loops-orange font-semibold tabular-nums">
              {formatCountdown(timeLeft as number)}
            </span>
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="font-outfit text-loops-light text-sm leading-6 font-medium">
            {t("auth.verify.no_code_received")}
          </p>

          <Button
            className={cn(
              "font-outfit border-loops-cyan text-loops-cyan hover:bg-loops-cyan/10 hover:text-loops-cyan min-h-11 rounded-xl border-2 bg-transparent px-4 text-sm font-semibold shadow-none",
              isRequestingCode ? "opacity-70" : undefined,
            )}
            disabled={isRequestingCode}
            onClick={() => {
              void requestConfirmationCode({ shouldToast: true })
            }}
            type="button"
            variant="outline"
          >
            {isRequestingCode
              ? t("auth.verify.resend_loading")
              : t("auth.verify.resend_button")}
          </Button>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <AlertCircle className="text-loops-warning mt-0.5 size-5 shrink-0" />
          <p className="font-outfit text-loops-warning text-left text-sm leading-6 font-medium">
            {t("auth.verify.important_note")}
          </p>
        </div>
      </form>
    </div>
  )
}

export const getRemainingSecondsFromExpiresAt = (
  expiresAt: Date | string,
  { now = Date.now() }: { now?: number } = {},
) => Math.max(0, Math.floor((new Date(expiresAt).getTime() - now) / 1000))

export const shouldShowExpirationTimer = ({
  hasResendTimer,
  timeLeft,
}: {
  hasResendTimer: boolean
  timeLeft: null | number
}) => hasResendTimer && timeLeft !== null && timeLeft > 0

export const formatCountdown = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0")
  const seconds = (totalSeconds % 60).toString().padStart(2, "0")

  return `${minutes}:${seconds}`
}

export const getConfirmationCodeExpirationKey = (userId: string) =>
  `${confirmationCodeExpirationSessionPrefix}:${userId}`

export const getRemainingMinutes = (totalSeconds: number) =>
  Math.max(1, Math.ceil(totalSeconds / 60))

export const readStoredTimeLeft = (userId: string) => {
  if (typeof window === "undefined") return null

  const storedExpiration = window.sessionStorage.getItem(
    getConfirmationCodeExpirationKey(userId),
  )

  if (!storedExpiration) return null

  const expirationTimestamp = Number(storedExpiration)
  if (!Number.isFinite(expirationTimestamp)) {
    window.sessionStorage.removeItem(getConfirmationCodeExpirationKey(userId))
    return null
  }

  const remainingSeconds = Math.max(
    0,
    Math.floor((expirationTimestamp - Date.now()) / 1000),
  )

  if (remainingSeconds === 0) {
    window.sessionStorage.removeItem(getConfirmationCodeExpirationKey(userId))
    return null
  }

  return remainingSeconds
}
