import type * as React from "react"

import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

import { useRequestResetPassword } from "@/modules/authentication/features/reset-password/services/use-request-reset-password"
import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { BriefCaseIcon } from "@/modules/shared/components/icons/brief-case"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { useToast } from "@/modules/shared/hooks/use-toast"

type ResetPasswordEmailStepProps = {
  onSuccess?: (email: string) => void
}

export function ResetPasswordEmailStep({
  onSuccess,
}: ResetPasswordEmailStepProps) {
  const { handleRequestResetPassword } = useRequestResetPassword()
  const { error: toastError, success: toastSuccess } = useToast()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: { email: "" },
    onSubmit: async ({ formApi, value }) => {
      if (!formApi.state.isSubmitting) return

      const response = await handleRequestResetPassword(form.state.values.email)

      if (response._tag === "Failure") {
        if (response.error.code === "invalid_input") {
          form.setFieldMeta("email", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.reset_password.invalid_email") },
            errors: [t("auth.reset_password.invalid_email")],
            isTouched: true,
          }))

          return
        }

        if (response.error.code === "email_not_found") {
          form.setFieldMeta("email", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.reset_password.email_not_found") },
            errors: [t("auth.reset_password.email_not_found")],
            isTouched: true,
          }))

          return
        }

        toastError(t("auth.reset_password.request_failed"), {
          description: t("auth.reset_password.request_failed_description"),
        })
        return response
      }

      toastSuccess(t("auth.reset_password.request_success"), {
        description: t("auth.reset_password.request_success_description"),
      })

      onSuccess?.(value.email)
    },
  })

  return (
    <div className="flex w-full flex-col items-start gap-y-8">
      <div className="flex w-full flex-col items-start gap-y-4">
        <h2 className="font-outfit text-loops-orange text-center text-3xl leading-5 font-bold tracking-tight wrap-break-word">
          {t("auth.reset_password.request_title")}
        </h2>
        <p className="font-outfit text-loops-light text-sm leading-6 font-medium">
          {t("auth.reset_password.request_description")}
        </p>
      </div>

      <form
        className="flex w-full flex-col items-start gap-y-8"
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="flex w-full flex-col items-start gap-y-4">
          <form.Field name="email">
            {(field) => (
              <form.Subscribe selector={(state) => [state.isSubmitting]}>
                {([isSubmitting]) => (
                  <div className="flex w-full flex-col items-start gap-y-1">
                    <label
                      className="font-outfit text-loops-light text-sm leading-5 font-normal"
                      htmlFor="email"
                    >
                      {t("auth.reset_password.email_label")}
                    </label>
                    <div className="bg-loops-auth-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                      <div className="text-loops-cyan size-6 shrink-0 grow-0">
                        <BriefCaseIcon />
                      </div>
                      <Input
                        className="font-outfit placeholder:font-outfit text-loops-light placeholder:text-loops-light/90 border-none bg-transparent font-semibold shadow-none focus:outline-none"
                        id="email"
                        name="email"
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        placeholder={t("auth.reset_password.email_placeholder")}
                        type="email"
                        value={field.state.value}
                      />
                    </div>
                    <div className="flex w-full items-start gap-x-2">
                      <AlertCircle className="text-loops-cyan mt-0.5 size-4 shrink-0" />
                      <p className="font-outfit text-loops-cyan text-sm leading-5 font-medium">
                        {t("auth.reset_password.request_email_hint")}
                      </p>
                    </div>

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <div className="flex w-full items-center gap-x-1">
                          <div className="text-loops-wrong size-4 shrink-0 grow-0">
                            <DangerIcon />
                          </div>
                          <p
                            className="text-loops-wrong font-outfit text-sm leading-5"
                            role="alert"
                          >
                            {field.state.meta.errors.join(", ")}
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </form.Subscribe>
            )}
          </form.Field>
        </div>

        <form.Subscribe selector={(state) => [state.isSubmitting]}>
          {([isSubmitting]) => (
            <Button
              className="font-outfit text-loops-text hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
              disabled={isSubmitting}
              type="submit"
            >
              {t("auth.reset_password.send_code")}
            </Button>
          )}
        </form.Subscribe>

        <Link
          className="text-loops-light font-outfit text-center text-sm leading-6 font-medium tracking-tight"
          search={buildAuthSearch("login")}
          to="/auth"
        >
          <span className="text-loops-cyan">
            {t("auth.reset_password.back_to_sign_in")}
          </span>
        </Link>
      </form>
    </div>
  )
}
