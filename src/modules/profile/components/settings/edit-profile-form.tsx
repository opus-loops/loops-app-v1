import { useForm } from "@tanstack/react-form"
import { ChevronDown, Phone, User2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"

import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { useToast } from "@/modules/shared/hooks/use-toast"

import { useUpdatePreferences } from "../../hooks/use-update-preferences"
import { countryCodeOptions, splitPhoneNumber } from "../../utils/phone-utils"
import { AvatarUpload } from "./avatar-upload"

type EditProfileFormProps = {
  user: User
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { handleUpdatePreferences } = useUpdatePreferences()
  const { error: toastError, success: toastSuccess } = useToast()
  const { t } = useTranslation()

  const initialPhone = useMemo(
    () => splitPhoneNumber(user.phoneNumber),
    [user.phoneNumber],
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<null | string>(null)
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<null | string>(
    null,
  )

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:"))
        URL.revokeObjectURL(avatarPreviewUrl)
    }
  }, [avatarPreviewUrl])

  const form = useForm({
    defaultValues: {
      fullName: user.fullName,
      phoneCountryCode: initialPhone.countryCode,
      phoneNationalNumber: initialPhone.nationalNumber,
      username: user.username,
    },
    onSubmit: async ({ value }) => {
      const phoneNationalNumber = value.phoneNationalNumber
        .trim()
        .replace(/[^\d]/g, "")

      const phoneNumber = `${value.phoneCountryCode}${phoneNationalNumber}`

      const payload: Record<string, any> = {}

      if (value.fullName !== user.fullName) {
        payload.fullName = value.fullName.trim() || undefined
      }

      if (value.username !== user.username) {
        payload.username = value.username.trim() || undefined
      }

      const initialPhoneNumberConstructed = `${initialPhone.countryCode}${initialPhone.nationalNumber}`
      if (phoneNumber !== initialPhoneNumberConstructed) {
        payload.phoneNumber = phoneNumber
      }

      if (avatarFile) {
        payload.avatarFile = avatarFile
      } else if (uploadedAvatarUrl) {
        payload.avatarURL = uploadedAvatarUrl
      }

      if (Object.keys(payload).length === 0) {
        toastSuccess(t("profile.updated_success"))
        return
      }

      const result = await handleUpdatePreferences(payload)

      if (result._tag === "Failure") {
        if ("uploadedAvatarURL" in result && result.uploadedAvatarURL) {
          setUploadedAvatarUrl(result.uploadedAvatarURL)
          setAvatarFile(null)
          setAvatarPreviewUrl(result.uploadedAvatarURL)
        }

        if (result.error.code === "taken_username") {
          form.setFieldMeta("username", (prev) => ({
            ...prev,
            errorMap: { onSubmit: t("profile.errors.username_taken") },
            errors: [t("profile.errors.username_taken")],
          }))
          return
        }

        if (result.error.code === "invalid_input") {
          const payload = result.error.payload

          if (payload.fullName) {
            form.setFieldMeta("fullName", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_fullname") },
              errors: [t("profile.errors.invalid_fullname")],
            }))
          }
          if (payload.username) {
            form.setFieldMeta("username", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_username") },
              errors: [t("profile.errors.invalid_username")],
            }))
          }
          if (payload.phoneNumber) {
            form.setFieldMeta("phoneNationalNumber", (prev) => ({
              ...prev,
              errorMap: { onSubmit: t("profile.errors.invalid_phone") },
              errors: [t("profile.errors.invalid_phone")],
            }))
          }
          return
        }

        toastError(t("auth.login.unexpected_error"))
        return
      }

      toastSuccess(t("profile.updated_success"))
      setAvatarFile(null)
      setUploadedAvatarUrl(null)
      setAvatarPreviewUrl(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
    },
  })

  const displayedAvatarUrl = avatarPreviewUrl || user.avatarURL

  return (
    <form
      className="mt-10 flex w-full flex-col"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        void form.handleSubmit()
      }}
    >
      <div className="flex flex-col items-center">
        <AvatarUpload
          displayedAvatarUrl={displayedAvatarUrl}
          fileInputRef={fileInputRef}
          fullName={user.fullName}
          hasNewAvatar={!!(avatarFile || uploadedAvatarUrl)}
          onFileSelect={(file) => {
            if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:"))
              URL.revokeObjectURL(avatarPreviewUrl)
            setAvatarFile(file)
            setUploadedAvatarUrl(null)
            setAvatarPreviewUrl(URL.createObjectURL(file))
          }}
          onRemove={() => {
            if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:"))
              URL.revokeObjectURL(avatarPreviewUrl)
            setAvatarFile(null)
            setUploadedAvatarUrl(null)
            setAvatarPreviewUrl(null)
          }}
        />

        <form.Subscribe selector={(state) => state.values}>
          {(values) => (
            <p className="text-loops-light mt-4 text-2xl font-semibold">
              {values.fullName?.trim() || user.fullName}
            </p>
          )}
        </form.Subscribe>
      </div>

      <div className="mt-10 flex flex-col gap-5">
        <form.Field name="fullName">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label
                className="text-loops-light text-sm font-medium"
                htmlFor={field.name}
              >
                {t("profile.labels.full_name")}
              </label>
              <div className="flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4">
                <User2 className="text-loops-cyan h-5 w-5" />
                <Input
                  className="border-none bg-transparent p-0 text-black shadow-none focus-visible:ring-0"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("profile.fields.full_name")}
                  value={field.state.value}
                />
              </div>
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
                <p className="text-destructive text-[0.8rem] font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field name="username">
          {(field) => (
            <div className="flex flex-col gap-2">
              <label
                className="text-loops-light text-sm font-medium"
                htmlFor={field.name}
              >
                {t("profile.labels.username")}
              </label>
              <div className="flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4">
                <User2 className="text-loops-cyan h-5 w-5" />
                <Input
                  className="border-none bg-transparent p-0 text-black shadow-none focus-visible:ring-0"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("profile.fields.username")}
                  value={field.state.value}
                />
              </div>
              {field.state.meta.isTouched &&
              field.state.meta.errors.length > 0 ? (
                <p className="text-destructive text-[0.8rem] font-medium">
                  {field.state.meta.errors.join(", ")}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <div className="flex flex-col gap-2">
          <label className="text-loops-light text-sm font-medium">
            {t("profile.labels.phone")}
          </label>
          <div className="focus-within:ring-loops-cyan/30 flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4 ring-offset-white focus-within:ring-2 focus-within:ring-offset-2">
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
      </div>

      <form.Subscribe selector={(state) => [state.isSubmitting]}>
        {([isSubmitting]) => (
          <Button
            className="bg-loops-cyan hover:bg-loops-cyan/90 text-loops-light mt-10 h-14 w-full rounded-xl text-lg font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? t("common.saving") : t("common.save")}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
