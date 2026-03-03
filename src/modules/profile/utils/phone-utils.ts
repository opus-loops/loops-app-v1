import countryCodesRaw from "@/data/country-codes.json"

export type CountryCodeRaw = {
  code: string
  dial_code: string
  name: string
}

export function normalizeDialCode(dialCode: string) {
  return dialCode.replace(/\s+/g, "")
}

export function toFlagEmoji(countryCode: string) {
  const normalized = countryCode.toUpperCase()
  if (!/^[A-Z]{2}$/.test(normalized)) return ""
  const [a, b] = normalized
  return String.fromCodePoint(
    a.charCodeAt(0) + 127397,
    b.charCodeAt(0) + 127397,
  )
}

export const countryCodeOptions = (countryCodesRaw as Array<CountryCodeRaw>)
  .map((c) => {
    const dialCode = normalizeDialCode(c.dial_code)
    const flagEmoji = toFlagEmoji(c.code)
    return {
      code: c.code,
      dialCode,
      flagEmoji,
      label: `${flagEmoji} ${dialCode} ${c.name}`.trim(),
      name: c.name,
      value: dialCode,
    }
  })
  .filter((c) => c.dialCode.startsWith("+") && c.dialCode.length > 1)

export function splitPhoneNumber(rawPhoneNumber: string | undefined) {
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
