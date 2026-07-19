export const PENDING_LANGUAGE_KEY = "loopsSelectedLanguage"

export const SUPPORTED_LANGUAGES = ["ar", "en", "fr"] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const parseSupportedLanguage = (
  value: unknown,
): SupportedLanguage | undefined =>
  SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)
    ? (value as SupportedLanguage)
    : undefined
