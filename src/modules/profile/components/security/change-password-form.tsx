import { useForm } from "@tanstack/react-form"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"
import { useUpdatePassword } from "../../hooks/use-update-password"

import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { PasswordInput } from "@/modules/shared/components/ui/password-input"
import { useToast } from "@/modules/shared/hooks/use-toast"

type ChangePasswordFormProps = {
  user: User
}

export function ChangePasswordForm({ user }: ChangePasswordFormProps) {
  const { handleUpdatePassword } = useUpdatePassword()
  const { error: toastError, success: toastSuccess } = useToast()
  const { t } = useTranslation()

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
    onSubmit: async ({ value }) => {
      const result = await handleUpdatePassword(
        value.currentPassword,
        value.newPassword,
      )

      if (result._tag === "Failure") {
        if (result.error.code === "UnmatchedPassword") {
          form.setFieldMeta("currentPassword", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("profile.errors.password_incorrect") },
            errors: [t("profile.errors.password_incorrect")],
          }))
          return
        }

        if (result.error.code === "user_password_not_set_or_invalid_provider") {
          toastError(t("profile.errors.password_account_type_error"))
          return
        }

        toastError(t("common.unexpected_error"))
        return
      }

      toastSuccess(t("profile.errors.password_changed_success"))
    },
  })

  return (
    <div className="flex w-full max-w-sm flex-col items-center px-4">
      {/* Header */}
      <h1 className="font-outfit text-loops-light mb-8 text-xl font-bold">
        Password
      </h1>

      {/* Avatar */}
      <div className="mb-2">
        {user.avatarURL ? (
          <img
            alt={user.fullName}
            className="border-loops-light h-24 w-24 rounded-full border-4 object-cover"
            src={user.avatarURL}
          />
        ) : (
          <div className="bg-loops-l flex h-24 w-24 items-center justify-center rounded-full">
            <div className="text-loops-light h-12 w-12">
              <UserIcon />
            </div>
          </div>
        )}
      </div>

      {/* Name */}
      <h2 className="font-outfit text-loops-pink mb-12 text-2xl font-bold">
        {user.fullName}
      </h2>

      {/* Change Password Section */}
      <div className="w-full">
        <div className="relative mb-8">
          <h3 className="font-outfit text-loops-light mb-2 text-xl font-bold">
            Change Password
          </h3>
          <div className="border-loops-light/30 h-px w-full border-b border-dashed" />
        </div>

        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          {/* Current Password */}
          <form.Field name="currentPassword">
            {(field) => (
              <div className="space-y-2">
                <label
                  className="font-outfit text-loops-light ml-1 text-sm"
                  htmlFor={field.name}
                >
                  Current Password
                </label>
                <PasswordInput
                  className="font-outfit focus-within:ring-loops-cyan h-14 rounded-xl bg-white px-4 focus-within:ring-2"
                  id={field.name}
                  inputClassName="text-black placeholder:text-gray-400"
                  leftIcon={<LockIcon />}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  value={field.state.value}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 ? (
                  <div className="ml-1 flex items-center gap-x-1">
                    <div className="text-loops-wrong h-4 w-4 shrink-0">
                      <DangerIcon />
                    </div>
                    <p className="text-loops-wrong font-outfit text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* New Password */}
          <form.Field name="newPassword">
            {(field) => (
              <div className="space-y-2">
                <label
                  className="font-outfit text-loops-light ml-1 text-sm"
                  htmlFor={field.name}
                >
                  New Password
                </label>
                <PasswordInput
                  className="font-outfit focus-within:ring-loops-cyan h-14 rounded-xl bg-white px-4 focus-within:ring-2"
                  id={field.name}
                  inputClassName="text-black placeholder:text-gray-400"
                  leftIcon={<LockIcon />}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="••••••••"
                  value={field.state.value}
                />
                {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 ? (
                  <div className="ml-1 flex items-center gap-x-1">
                    <div className="text-loops-wrong h-4 w-4 shrink-0">
                      <DangerIcon />
                    </div>
                    <p className="text-loops-wrong font-outfit text-sm">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </form.Field>

          {/* Submit Button */}
          <form.Subscribe selector={(state) => [state.isSubmitting]}>
            {([isSubmitting]) => (
              <Button
                className="bg-loops-cyan hover:bg-loops-cyan/90 font-outfit mt-4 h-14 w-full rounded-xl text-lg font-bold text-white shadow-none disabled:cursor-not-allowed disabled:opacity-50"
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
                  "Change"
                )}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}
