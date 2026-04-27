import type * as React from "react"

import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  evaluatePasswordRules,
  passwordRuleOrder,
  passwordRuleTranslationKeys,
} from "@/modules/authentication/features/register/services/password-validation"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { ShieldSecurityIcon } from "@/modules/shared/components/icons/shield-security"
import { PasswordInput } from "@/modules/shared/components/ui/password-input"
import { cn } from "@/modules/shared/lib/utils"

type ResetPasswordPasswordFieldProps = {
  errors: Array<string>
  isTouched: boolean
  onBlur: React.FocusEventHandler<HTMLInputElement>
  onChange: (value: string) => void
  value: string
}

type ResetPasswordPasswordStepProps = {
  confirmPassword: ResetPasswordPasswordFieldProps
  password: ResetPasswordPasswordFieldProps
}

export function ResetPasswordPasswordStep({
  confirmPassword,
  password,
}: ResetPasswordPasswordStepProps) {
  const { t } = useTranslation()
  const passwordRules = evaluatePasswordRules(password.value)
  const showPasswordRules = password.value.length > 0
  const showPasswordError = password.isTouched && password.errors.length > 0
  const passwordChecklistId = "password-rules"
  const passwordErrorId = "password-error"
  const describedBy = [
    showPasswordRules ? passwordChecklistId : null,
    showPasswordError ? passwordErrorId : null,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="flex w-full flex-col items-start gap-y-8">
      <div className="flex w-full flex-col items-center gap-y-4">
        <div
          aria-hidden="true"
          className="text-loops-orange size-20 shrink-0 grow-0"
        >
          <ShieldSecurityIcon />
        </div>

        <h2 className="font-outfit text-loops-orange text-center text-3xl leading-5 font-bold tracking-tight wrap-break-word">
          {t("auth.reset_password.password_title")}
        </h2>
        <p className="font-outfit text-loops-light text-sm leading-6 font-medium">
          {t("auth.reset_password.password_description")}
        </p>
      </div>

      <div className="flex w-full flex-col items-start gap-y-1">
        <label
          className="font-outfit text-loops-light text-sm leading-5 font-normal"
          htmlFor="password"
        >
          {t("auth.reset_password.new_password_label")}
        </label>
        <PasswordInput
          aria-describedby={describedBy || undefined}
          aria-invalid={showPasswordError || undefined}
          className="bg-loops-auth-card"
          id="password"
          leftIcon={<LockIcon />}
          name="password"
          onBlur={password.onBlur}
          onChange={(event) => password.onChange(event.target.value)}
          placeholder={t("auth.reset_password.new_password_placeholder")}
          value={password.value}
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
                      isSatisfied ? "text-loops-correct" : "text-loops-wrong",
                    )}
                  >
                    {isSatisfied ? (
                      <Check className="h-full w-full" strokeWidth={3} />
                    ) : (
                      <X className="h-full w-full" strokeWidth={3} />
                    )}
                  </div>
                  <p
                    className={cn(
                      "font-outfit text-sm leading-5",
                      isSatisfied ? "text-loops-correct" : "text-loops-wrong",
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
      </div>

      <div className="flex w-full flex-col items-start gap-y-1">
        <label
          className="font-outfit text-loops-light text-sm leading-5 font-normal"
          htmlFor="confirmPassword"
        >
          {t("auth.reset_password.confirm_password_label")}
        </label>
        <PasswordInput
          className="bg-loops-auth-card"
          id="confirmPassword"
          leftIcon={<LockIcon />}
          name="confirmPassword"
          onBlur={confirmPassword.onBlur}
          onChange={(event) => confirmPassword.onChange(event.target.value)}
          placeholder={t("auth.reset_password.confirm_password_placeholder")}
          value={confirmPassword.value}
        />

        {confirmPassword.isTouched && confirmPassword.errors.length > 0 && (
          <div className="flex w-full items-center gap-x-1">
            <div className="text-loops-wrong size-4 shrink-0 grow-0">
              <DangerIcon />
            </div>
            <p
              className="text-loops-wrong font-outfit text-sm leading-5"
              role="alert"
            >
              {confirmPassword.errors.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
