import { useForm } from "@tanstack/react-form"
import * as React from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useConfirmResetPassword } from "@/modules/authentication/features/reset-password/services/use-confirm-reset-password"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

import { ResetPasswordCodeStep } from "./reset-password-code-step"
import { ResetPasswordEmailStep } from "./reset-password-email-step"
import { ResetPasswordPasswordStep } from "./reset-password-password-step"
import { useResetPasswordStepper } from "./reset-password-stepper"
import { ResetPasswordSuccessPanel } from "./reset-password-success-panel"

const parseResetPasswordConfirmationCode = (value: string) => {
  const trimmedValue = value.trim()

  if (!/^\d+$/.test(trimmedValue)) return null
  if (trimmedValue.length !== 5) return null

  return Number.parseInt(trimmedValue, 10)
}

const getResetPasswordConfirmFieldFromCode = (code: string) => {
  if (code === "invalid_expired_code") return "confirmationCode"
  if (code === "unmatched_password") return "confirmPassword"
  if (code === "user_not_found") return "email"
  return null
}

type ResetPasswordFieldName =
  | "confirmationCode"
  | "confirmPassword"
  | "password"

export function ResetPasswordForm() {
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>()
  const { currentStep, goToStep } = useResetPasswordStepper()
  const { handleConfirmResetPassword } = useConfirmResetPassword()
  const { error: toastError } = useToast()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      confirmationCode: "",
      confirmPassword: "",
      password: "",
    },
    onSubmit: async ({ formApi, value }) => {
      if (!formApi.state.isSubmitting) return

      if (value.password !== value.confirmPassword) {
        setFieldError(
          "confirmPassword",
          "auth.reset_password.password_mismatch",
        )
        return
      }

      const confirmationCode = parseResetPasswordConfirmationCode(
        value.confirmationCode,
      )

      if (confirmationCode === null) {
        setFieldError("confirmationCode", "auth.reset_password.invalid_code")
        goToStep("code")
        return
      }

      if (!resetPasswordEmail) {
        toastError(t("auth.reset_password.invalid_email"))
        return
      }

      const response = await handleConfirmResetPassword({
        confirmationCode,
        confirmPassword: value.confirmPassword,
        email: resetPasswordEmail,
        password: value.password,
      })

      if (response._tag === "Failure") {
        if (response.error.code === "invalid_input") {
          const payload = response.error.payload

          if (payload.confirmationCode) {
            setFieldError(
              "confirmationCode",
              "auth.reset_password.invalid_code",
            )
          }

          if (payload.password) {
            setFieldError("password", "auth.reset_password.invalid_password")
          }

          if (payload.confirmPassword) {
            setFieldError(
              "confirmPassword",
              "auth.reset_password.invalid_confirm_password",
            )
          }

          return
        }

        const fieldName = getResetPasswordConfirmFieldFromCode(
          response.error.code,
        )

        if (fieldName === "confirmationCode") {
          setFieldError("confirmationCode", "auth.reset_password.expired_code")
          goToStep("code")
          return
        }

        if (fieldName === "confirmPassword") {
          setFieldError(
            "confirmPassword",
            "auth.reset_password.password_mismatch",
          )
          return
        }

        toastError(t("auth.reset_password.confirm_failed"), {
          description: t("auth.reset_password.confirm_failed_description"),
        })
        return
      }

      goToStep("success")
    },
  })

  function setFieldError(
    fieldName: ResetPasswordFieldName,
    translationKey: string,
  ) {
    form.setFieldMeta(fieldName, (prev) => ({
      ...prev,
      errorMap: { onSubmit: t(translationKey) },
      errors: [t(translationKey)],
      isTouched: true,
    }))
  }

  const isCodeStep = currentStep === "code"
  const isEmailStep = currentStep === "email"
  const isPasswordStep = currentStep === "password"
  const isSuccessStep = currentStep === "success"

  if (isEmailStep)
    return (
      <ResetPasswordEmailStep
        onSuccess={(email) => {
          setResetPasswordEmail(email)
          goToStep("code")
        }}
      />
    )

  if (isSuccessStep) return <ResetPasswordSuccessPanel />

  return (
    <form
      className="flex flex-col gap-y-6"
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        form.handleSubmit()
      }}
    >
      {resetPasswordEmail && (
        <>
          {isCodeStep ? (
            <form.Field name="confirmationCode">
              {(field) => (
                <ResetPasswordCodeStep
                  errors={field.state.meta.errors as unknown as Array<string>}
                  handleSubmitVerificationCode={() => goToStep("password")}
                  isTouched={field.state.meta.isTouched}
                  onChange={field.handleChange}
                  resetPasswordEmail={resetPasswordEmail}
                />
              )}
            </form.Field>
          ) : null}

          {isPasswordStep ? (
            <form.Field name="password">
              {(passwordField) => (
                <form.Field name="confirmPassword">
                  {(confirmPasswordField) => (
                    <ResetPasswordPasswordStep
                      confirmPassword={{
                        errors: confirmPasswordField.state.meta
                          .errors as unknown as Array<string>,
                        isTouched: confirmPasswordField.state.meta.isTouched,
                        onBlur: confirmPasswordField.handleBlur,
                        onChange: confirmPasswordField.handleChange,
                        value: confirmPasswordField.state.value,
                      }}
                      password={{
                        errors: passwordField.state.meta
                          .errors as unknown as Array<string>,
                        isTouched: passwordField.state.meta.isTouched,
                        onBlur: passwordField.handleBlur,
                        onChange: passwordField.handleChange,
                        value: passwordField.state.value,
                      }}
                    />
                  )}
                </form.Field>
              )}
            </form.Field>
          ) : null}

          {isPasswordStep && (
            <form.Subscribe selector={(state) => [state.isSubmitting]}>
              {([isSubmitting]) => (
                <Button
                  className="font-outfit text-loops-text hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting
                    ? t("auth.reset_password.confirm_submitting")
                    : t("auth.reset_password.confirm_submit")}
                </Button>
              )}
            </form.Subscribe>
          )}
        </>
      )}
    </form>
  )
}
