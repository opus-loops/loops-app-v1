import { useForm } from "@tanstack/react-form"
import { ChevronDown, Mail, Phone, User } from "lucide-react"
import { useTranslation } from "react-i18next"

import { useRegister } from "@/modules/authentication/features/register/services/use-register"
import { countryCodeOptions } from "@/modules/profile/utils/phone-utils"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { PasswordInput } from "@/modules/shared/components/ui/password-input"
import { useToast } from "@/modules/shared/hooks/use-toast"

export function RegisterForm() {
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
    onSubmit: async ({ value, formApi }) => {
      if (!formApi.state.canSubmit) return

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

      if (response._tag === "Failure") {
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
      }
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
                className="font-outfit text-loops-white text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.fullname_label")}
              </label>
              <div className="bg-loops-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <User className="h-full w-full" />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none"
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
                className="font-outfit text-loops-white text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.username_label")}
              </label>
              <div className="bg-loops-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <UserIcon />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none"
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
                className="font-outfit text-loops-white text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.email_label")}
              </label>
              <div className="bg-loops-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                <div className="text-loops-cyan size-6 shrink-0 grow-0">
                  <Mail className="h-full w-full" />
                </div>
                <Input
                  className="font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none"
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
          <div className="focus-within:ring-loops-cyan/30 flex h-14 w-full items-center gap-3 rounded-md bg-white px-4 py-5 ring-offset-white focus-within:ring-2 focus-within:ring-offset-2">
            <Phone className="text-loops-cyan h-5 w-5 shrink-0" />
            <div className="flex flex-1 items-center gap-3">
              <form.Field name="phoneCountryCode">
                {(field) => (
                  <div className="relative flex items-center">
                    <select
                      className="h-10 w-[150px] cursor-pointer appearance-none truncate bg-transparent pr-6 text-sm font-medium text-black outline-none"
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
                    className="h-auto border-none bg-transparent p-0 text-sm text-black shadow-none placeholder:text-gray-400 focus-visible:ring-0"
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
          {(field) => (
            <div className="flex w-full flex-col items-start gap-y-1">
              <label
                className="font-outfit text-loops-white text-sm leading-5 font-normal"
                htmlFor={field.name}
              >
                {t("auth.register.password_label")}
              </label>
              <PasswordInput
                className="bg-loops-card"
                id={field.name}
                leftIcon={<LockIcon />}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={t("auth.register.password_placeholder")}
                value={field.state.value}
              />
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
      </div>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? (
              <svg
                className="h-6 w-6 animate-spin text-white"
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
