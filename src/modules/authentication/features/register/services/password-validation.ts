export const passwordRuleOrder = [
  "hasMinimumLength",
  "hasUppercase",
  "hasNumber",
  "hasSymbol",
] as const

export type PasswordRuleEvaluation = Record<PasswordRuleKey, boolean>

export type PasswordRuleKey = (typeof passwordRuleOrder)[number]

export const passwordRuleTranslationKeys = {
  hasMinimumLength: "auth.register.password_rules.minimum_length",
  hasNumber: "auth.register.password_rules.number",
  hasSymbol: "auth.register.password_rules.symbol",
  hasUppercase: "auth.register.password_rules.uppercase",
} satisfies Record<PasswordRuleKey, string>

const uppercasePattern = /\p{Lu}/u
const numberPattern = /\p{Nd}/u
const symbolPattern = /[\p{P}\p{S}]/u

export function evaluatePasswordRules(
  password: string,
): PasswordRuleEvaluation {
  return {
    hasMinimumLength: password.length >= 8,
    hasNumber: numberPattern.test(password),
    hasSymbol: symbolPattern.test(password),
    hasUppercase: uppercasePattern.test(password),
  }
}
