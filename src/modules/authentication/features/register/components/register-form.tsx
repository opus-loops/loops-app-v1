import { useForm } from "@tanstack/react-form"
import { Check, ChevronDown, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  evaluatePasswordRules,
  passwordRuleOrder,
  passwordRuleTranslationKeys,
} from "@/modules/authentication/features/register/services/password-validation"
import { useRegister } from "@/modules/authentication/features/register/services/use-register"
import { countryCodeOptions } from "@/modules/profile/utils/phone-utils"
import { BriefCaseIcon } from "@/modules/shared/components/icons/brief-case"
import { CallIcon } from "@/modules/shared/components/icons/call"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { PasswordInput } from "@/modules/shared/components/ui/password-input"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { cn } from "@/modules/shared/lib/utils"

type RegisterFormProps = {
  onSuccess?: (credentials: { password: string; username: string }) => void
  redirect?: string
}

export function RegisterForm({ onSuccess, redirect }: RegisterFormProps = {}) {
  const { handleRegister } = useRegister()
  const { error: toastError } = useToast()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      phoneCountryCode: "+216",
      phoneNationalNumber: "",
      username: "",
    },
    onSubmit: async ({ formApi, value }) => {
      if (!formApi.state.isSubmitting) return

      const phoneNationalNumber = value.phoneNationalNumber
        .trim()
        .replace(/[^\d]/g, "")

      const phoneNumber = `${value.phoneCountryCode}${phoneNationalNumber}`

      const response = await handleRegister(
        value.email,
        value.fullName,
        value.password,
        phoneNumber,
        value.username,
      )

      if (response._tag === "Success") {
        onSuccess?.({ password: value.password, username: value.username })
        return
      }

      if (response.error.code === "invalid_input") {
        const payload = response.error.payload

        if (payload.email) {
          form.setFieldMeta("email", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.register.invalid_email") },
            errors: [t("auth.register.invalid_email")],
          }))
        }

        if (payload.fullName) {
          form.setFieldMeta("fullName", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.register.invalid_fullname") },
            errors: [t("auth.register.invalid_fullname")],
          }))
        }

        if (payload.password) {
          form.setFieldMeta("password", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.register.invalid_password") },
            errors: [t("auth.register.invalid_password")],
          }))
        }

        if (payload.phoneNumber) {
          form.setFieldMeta("phoneNationalNumber", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.register.invalid_phone") },
            errors: [t("auth.register.invalid_phone")],
          }))
        }

        if (payload.username) {
          form.setFieldMeta("username", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("auth.register.invalid_username") },
            errors: [t("auth.register.invalid_username")],
          }))
        }
        return
      }

      if (response.error.code === "user_already_exist")
        toastError(t("auth.register.user_already_exist"))
      else if (response.error.code === "taken_username")
        form.setFieldMeta("username", (prev) => ({
          ...prev,
          errorMap: { onSubmit: t("auth.register.username_taken") },
          errors: [t("auth.register.username_taken")],
        }))
      else if (response.error.code === "phone_number_already_used")
        form.setFieldMeta("phoneNationalNumber", (prev) => ({
          ...prev,
          errorMap: { onSubmit: t("auth.register.phone_taken") },
          errors: [t("auth.register.phone_taken")],
        }))
      else
        toastError(t("auth.register.failed"), {
          description: t("auth.register.unexpected_error"),
        })
    },
  })

  return (
    <form
      className="flex w-full flex-col items-start gap-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="flex w-full flex-col items-start gap-y-4">
        {/* Full Name */}
        <form.Field name="fullName">
          {(field) => (
            <div className="flex w-full flex-col items-start gap-y-1">
              <label
                className="font-outfit text-loops-light text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.fullname_label")}
              </label>
              <div className="bg-loops-auth-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <UserIcon />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit placeholder:text-loops-light/90 text-loops-light border-none bg-transparent font-semibold shadow-none focus:outline-none"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("auth.register.fullname_placeholder")}
                  value={field.state.value}
                />
              </div>
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
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

        {/* Username */}
        <form.Field name="username">
          {(field) => (
            <div className="flex w-full flex-col items-start gap-y-1">
              <label
                className="font-outfit text-loops-light text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.username_label")}
              </label>
              <div className="bg-loops-auth-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <UserIcon />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit text-loops-light placeholder:text-loops-light/90 border-none bg-transparent font-semibold shadow-none focus:outline-none"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("auth.register.username_placeholder")}
                  value={field.state.value}
                />
              </div>
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
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

        {/* Email */}
        <form.Field name="email">
          {(field) => (
            <div className="flex w-full flex-col items-start gap-y-1">
              <label
                className="font-outfit text-loops-light text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.email_label")}
              </label>
              <div className="bg-loops-auth-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <BriefCaseIcon />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit text-loops-light placeholder:text-loops-light/90 border-none bg-transparent font-semibold shadow-none focus:outline-none"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("auth.register.email_placeholder")}
                  type="email"
                  value={field.state.value}
                />
              </div>
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
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

        {/* Phone Number */}
        <div className="flex w-full flex-col gap-2">
          <label className="text-loops-light text-sm font-medium">
            {t("profile.labels.phone")}
          </label>
          <div className="focus-within:ring-loops-cyan/30 bg-loops-auth-card flex h-14 w-full items-center gap-3 rounded-md px-4 py-5 ring-offset-white focus-within:ring-2 focus-within:ring-offset-2">
            <div className="text-loops-cyan size-6 shrink-0 grow-0">
              <CallIcon />
            </div>

            <div className="flex flex-1 items-center gap-3">
              <form.Field name="phoneCountryCode">
                {(field) => (
                  <div className="relative flex items-center">
                    <select
                      className="text-loops-light h-10 w-[150px] cursor-pointer appearance-none truncate bg-transparent pr-6 text-sm font-medium outline-none"
                      id={field.name}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                    >
                      {countryCodeOptions.map((o) => (
                        <option key={o.code} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-0 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                )}
              </form.Field>

              <div className="h-6 w-px bg-gray-200" />

              <form.Field name="phoneNationalNumber">
                {(field) => (
                  <Input
                    className="text-loops-light placeholder:text-loops-light/90 h-auto border-none bg-transparent p-0 text-sm font-semibold shadow-none focus-visible:ring-0"
                    id={field.name}
                    inputMode="tel"
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("profile.fields.phone")}
                    value={field.state.value}
                  />
                )}
              </form.Field>
            </div>
          </div>

          <form.Field name="phoneNationalNumber">
            {(field) =>
              field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
                <p className="text-destructive text-[0.8rem] font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null
            }
          </form.Field>
        </div>

        {/* Password */}
        <form.Field name="password">
          {(field) => {
            const passwordRules = evaluatePasswordRules(field.state.value)
            const showPasswordRules = field.state.value.length > 0
            const showPasswordError =
              field.state.meta.isTouched && field.state.meta.errors.length > 0
            const passwordChecklistId = `${field.name}-rules`
            const passwordErrorId = `${field.name}-error`

            const describedBy = [
              showPasswordRules ? passwordChecklistId : null,
              showPasswordError ? passwordErrorId : null,
            ]
              .filter(Boolean)
              .join(" ")

            return (
              <div className="flex w-full flex-col items-start gap-y-1">
                <label
                  className="font-outfit text-loops-light text-sm leading-5 font-normal"
                  htmlFor={field.name}
                >
                  {t("auth.register.password_label")}
                </label>
                <PasswordInput
                  aria-describedby={describedBy || undefined}
                  aria-invalid={showPasswordError || undefined}
                  className="bg-loops-auth-card"
                  id={field.name}
                  leftIcon={<LockIcon />}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("auth.register.password_placeholder")}
                  value={field.state.value}
                />

                {showPasswordRules ? (
                  <ul
                    aria-live="polite"
                    className="flex w-full flex-col items-start gap-y-1"
                    id={passwordChecklistId}
                  >
                    {passwordRuleOrder.map((ruleKey) => {
                      const isSatisfied = passwordRules[ruleKey]
                      const ruleText = t(passwordRuleTranslationKeys[ruleKey])

                      return (
                        <li
                          className="flex w-full items-center gap-x-1.5"
                          key={ruleKey}
                        >
                          <div
                            aria-hidden="true"
                            className={cn(
                              "size-4 shrink-0 grow-0",
                              isSatisfied
                                ? "text-loops-correct"
                                : "text-loops-wrong",
                            )}
                          >
                            {isSatisfied ? (
                              <Check
                                className="h-full w-full"
                                strokeWidth={3}
                              />
                            ) : (
                              <X className="h-full w-full" strokeWidth={3} />
                            )}
                          </div>
                          <p
                            className={cn(
                              "font-outfit text-sm leading-5",
                              isSatisfied
                                ? "text-loops-correct"
                                : "text-loops-wrong",
                            )}
                          >
                            <span className="sr-only">
                              {isSatisfied
                                ? `${t("auth.register.password_rules.satisfied_prefix")} `
                                : `${t("auth.register.password_rules.unsatisfied_prefix")} `}
                            </span>
                            {ruleText}
                          </p>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}

                {showPasswordError ? (
                  <div
                    className="flex w-full items-center gap-x-1"
                    id={passwordErrorId}
                  >
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
                ) : null}
              </div>
            )
          }}
        </form.Field>
      </div>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button
            className="font-outfit text-loops-text hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <svg
                className="text-loops-light h-6 w-6 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  fill="currentColor"
                ></path>
              </svg>
            ) : (
              t("auth.register.submit")
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
