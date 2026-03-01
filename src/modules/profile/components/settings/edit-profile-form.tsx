import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import type { User } from "@/modules/shared/domain/entities/user"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { ChevronDown, Pencil, Phone, Trash2, User2 } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import countryCodesRaw from "virtual:country-codes"
import { useUpdatePreferences } from "../../hooks/use-update-preferences"

type CountryCodeRaw = {
  name: string
  dial_code: string
  code: string
}

function toFlagEmoji(countryCode: string) {
  const normalized = countryCode.toUpperCase()
  if (!/^[A-Z]{2}$/.test(normalized)) return ""
  const [a, b] = normalized
  return String.fromCodePoint(
    a.charCodeAt(0) + 127397,
    b.charCodeAt(0) + 127397,
  )
}

function normalizeDialCode(dialCode: string) {
  return dialCode.replace(/\s+/g, "")
}

const countryCodeOptions = (countryCodesRaw as CountryCodeRaw[])
  .map((c) => {
    const dialCode = normalizeDialCode(c.dial_code)
    const flagEmoji = toFlagEmoji(c.code)
    return {
      code: c.code,
      dialCode,
      flagEmoji,
      name: c.name,
      value: dialCode,
      label: `${flagEmoji} ${dialCode} ${c.name}`.trim(),
    }
  })
  .filter((c) => c.dialCode.startsWith("+") && c.dialCode.length > 1)

function splitPhoneNumber(rawPhoneNumber: string | undefined) {
  const cleaned = (rawPhoneNumber ?? "").trim().replace(/[^\d+]/g, "")
  const defaultResult = { countryCode: "+1", nationalNumber: "" }
  if (!cleaned.startsWith("+")) return defaultResult

  const withoutPlus = cleaned.slice(1)
  const candidates = Array.from(
    new Set(countryCodeOptions.map((o) => o.dialCode)),
  ).sort((a, b) => b.length - a.length)

  for (const code of candidates) {
    const digits = code.slice(1)
    if (withoutPlus.startsWith(digits)) {
      const nationalNumber = withoutPlus.slice(digits.length)
      return { countryCode: code, nationalNumber }
    }
  }

  const fallbackDigits = withoutPlus.slice(0, 3)
  return {
    countryCode: `+${fallbackDigits}`,
    nationalNumber: withoutPlus.slice(3),
  }
}

type EditProfileFormProps = {
  user: User
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const { handleUpdatePreferences } = useUpdatePreferences()
  const { error: toastError, success: toastSuccess } = useToast()

  const initialPhone = useMemo(
    () => splitPhoneNumber(user.phoneNumber),
    [user.phoneNumber],
  )

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null)
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
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
      username: user.username,
      phoneCountryCode: initialPhone.countryCode,
      phoneNationalNumber: initialPhone.nationalNumber,
    },
    validators: {
      onSubmitAsync: async ({ value }) => {
        const phoneNationalNumber = (value.phoneNationalNumber ?? "")
          .trim()
          .replace(/[^\d]/g, "")

        const phoneNumber = `${value.phoneCountryCode ?? ""}${phoneNationalNumber}`

        const payload: any = {}

        if ((value.fullName ?? "") !== (user.fullName ?? "")) {
          payload.fullName = (value.fullName ?? "").trim() || undefined
        }

        if ((value.username ?? "") !== (user.username ?? "")) {
          payload.username = (value.username ?? "").trim() || undefined
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
          toastSuccess("Profile updated successfully.")
          return null
        }

        const result = await handleUpdatePreferences(payload)

        if (result._tag === "Failure") {
          if ("uploadedAvatarURL" in result && result.uploadedAvatarURL) {
            setUploadedAvatarUrl(result.uploadedAvatarURL)
            setAvatarFile(null)
            setAvatarPreviewUrl(result.uploadedAvatarURL)
          }

          if (result.error.code === "taken_username") {
            return { username: result.error.message }
          }

          if (result.error.code === "invalid_input") {
            return {
              fullName: result.error.payload.fullName,
              username: result.error.payload.username,
              phoneNationalNumber: result.error.payload.phoneNumber,
            }
          }

          const message =
            "message" in result.error
              ? result.error.message
              : "An unexpected error occurred."

          toastError(message)
          return null
        }

        toastSuccess("Profile updated successfully.")
        setAvatarFile(null)
        setUploadedAvatarUrl(null)
        setAvatarPreviewUrl(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        return null
      },
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
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="focus-visible:ring-loops-cyan relative h-24 w-24 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#000016]"
          aria-label="Change avatar"
        >
          {displayedAvatarUrl ? (
            <img
              src={displayedAvatarUrl}
              alt={user.fullName}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="bg-loops-pink flex h-24 w-24 items-center justify-center rounded-full">
              <User2 className="text-loops-light h-10 w-10" />
            </div>
          )}

          <span className="bg-loops-light absolute right-0 bottom-0 inline-flex h-8 w-8 items-center justify-center rounded-full shadow-md">
            <Pencil className="h-4 w-4 text-[#000016]" />
          </span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (!file) return
            if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:"))
              URL.revokeObjectURL(avatarPreviewUrl)
            setAvatarFile(file)
            setUploadedAvatarUrl(null)
            setAvatarPreviewUrl(URL.createObjectURL(file))
          }}
        />

        {avatarFile || uploadedAvatarUrl ? (
          <button
            type="button"
            onClick={() => {
              if (avatarPreviewUrl && avatarPreviewUrl.startsWith("blob:"))
                URL.revokeObjectURL(avatarPreviewUrl)
              setAvatarFile(null)
              setUploadedAvatarUrl(null)
              setAvatarPreviewUrl(null)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#ff3b3b]"
            aria-label="Remove selected avatar"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        ) : null}

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
                htmlFor={field.name}
                className="text-loops-light text-sm font-medium"
              >
                Full Name
              </label>
              <div className="flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4">
                <User2 className="text-loops-cyan h-5 w-5" />
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Your full name"
                  className="border-none bg-transparent p-0 text-black shadow-none focus-visible:ring-0"
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
                htmlFor={field.name}
                className="text-loops-light text-sm font-medium"
              >
                Username
              </label>
              <div className="flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4">
                <User2 className="text-loops-cyan h-5 w-5" />
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Your username"
                  className="border-none bg-transparent p-0 text-black shadow-none focus-visible:ring-0"
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
            Phone Number
          </label>
          <div className="focus-within:ring-loops-cyan/30 flex h-14 w-full items-center gap-3 rounded-xl bg-white px-4 ring-offset-white focus-within:ring-2 focus-within:ring-offset-2">
            <Phone className="text-loops-cyan h-5 w-5 shrink-0" />
            <div className="flex flex-1 items-center gap-3">
              <form.Field name="phoneCountryCode">
                {(field) => (
                  <div className="relative flex items-center">
                    <select
                      id={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="h-10 w-[100px] cursor-pointer appearance-none truncate bg-transparent pr-6 text-sm font-medium text-black outline-none"
                    >
                      {countryCodeOptions.map((o) => (
                        <option key={o.value} value={o.value}>
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
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Your phone number"
                    inputMode="tel"
                    className="h-auto border-none bg-transparent p-0 text-sm text-black shadow-none placeholder:text-gray-400 focus-visible:ring-0"
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

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            disabled={!canSubmit}
            className="bg-loops-cyan hover:bg-loops-cyan/90 text-loops-light mt-10 h-14 w-full rounded-xl text-lg font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
