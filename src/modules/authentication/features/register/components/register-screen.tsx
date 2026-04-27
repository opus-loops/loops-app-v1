import type { PropsWithChildren } from "react"

import { Link, useRouter } from "@tanstack/react-router"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { LoginGoogle } from "@/modules/authentication/features/login/components/login-google"
import { useLogin } from "@/modules/authentication/features/login/services/use-login"
import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"

import { RegisterForm } from "./register-form"

type RegisterCredentials = {
  password: string
  username: string
}

type RegisterSuccessViewProps = {
  backLabel: string
  ctaLabel: string
  description: string
  imageAlt: string
  isSubmitting: boolean
  onBack: () => void
  onContinue: () => void
  overline: string
  subtitle: string
}

export function buildRegisterSuccessLoginArgs(
  credentials: RegisterCredentials,
  redirect?: string,
) {
  return [credentials.username, credentials.password, redirect] as const
}

export function getRegisterSuccessBackNavigation() {
  return { to: "/auth" as const }
}

export function RegisterScreen({ redirect }: { redirect?: string }) {
  const { t } = useTranslation()
  const [submittedCredentials, setSubmittedCredentials] =
    useState<null | RegisterCredentials>(null)
  const redirectProps = redirect ? { redirect } : {}

  if (submittedCredentials)
    return (
      <RegisterSuccessScreen
        credentials={submittedCredentials}
        {...redirectProps}
      />
    )

  return (
    <AuthScreenWrapper>
      <h2 className="font-outfit text-loops-purple text-center text-3xl leading-5 font-bold tracking-tight wrap-break-word">
        {t("auth.register.title")}
      </h2>

      <RegisterForm
        {...redirectProps}
        onSuccess={(credentials) => {
          setSubmittedCredentials(credentials)
        }}
      />

      <div className="flex w-full items-center gap-x-4">
        <div className="bg-loops-gray h-px flex-1" />
        <span className="text-loops-gray font-outfit text-base leading-5 font-normal">
          {t("common.or")}
        </span>
        <div className="bg-loops-gray h-px flex-1" />
      </div>

      <div className="flex w-full flex-col items-center gap-y-10">
        <div className="flex w-full flex-col items-center gap-y-5">
          <LoginGoogle {...redirectProps} />
        </div>
        <Link
          className="text-loops-light font-outfit text-center text-sm leading-6 font-medium tracking-tight"
          search={buildAuthSearch("login", redirect)}
          to="/auth"
        >
          {t("auth.register.have_account")}{" "}
          <span className="text-loops-cyan">{t("auth.register.sign_in")}</span>
        </Link>
      </div>
    </AuthScreenWrapper>
  )
}

export function RegisterSuccessView({
  backLabel,
  ctaLabel,
  description,
  imageAlt,
  isSubmitting,
  onBack,
  onContinue,
  overline,
  subtitle,
}: RegisterSuccessViewProps) {
  return (
    <AuthScreenWrapper>
      <div className="flex w-full shrink-0 grow-0 justify-start">
        <button
          aria-label={backLabel}
          className="focus-visible:ring-loops-cyan/40 bg-loops-auth-card/70 hover:bg-loops-auth-card flex min-h-11 min-w-11 items-center justify-center rounded-xl p-2 shadow-none transition-all duration-200 focus-visible:ring-2 focus-visible:outline-none"
          onClick={onBack}
          type="button"
        >
          <span className="bg-loops-cyan flex h-6 w-6 items-center justify-center rounded-full">
            <ChevronLeft className="text-loops-main h-4 w-4" />
          </span>
        </button>
      </div>

      <div className="flex w-full shrink-0 grow flex-col items-center gap-y-6 text-center">
        <img
          alt={imageAlt}
          className="h-auto w-full max-w-72"
          src="/images/winning-loops.png"
        />

        <div className="flex w-full flex-col items-center gap-y-3">
          <p className="font-outfit text-loops-orange text-center text-[2rem] leading-tight font-bold tracking-tight wrap-break-word">
            {overline}
          </p>

          <h2 className="font-outfit text-loops-cyan text-center text-3xl leading-tight font-bold tracking-tight wrap-break-word">
            {subtitle}
          </h2>

          <p className="font-outfit text-loops-light text-center text-base leading-7 font-medium tracking-tight">
            {description}
          </p>
        </div>

        <Button
          className="font-outfit text-loops-text hover:bg-loops-cyan/90 bg-loops-cyan flex min-h-14 w-full items-center justify-center rounded-xl px-6 py-4 text-lg leading-5 font-semibold shadow-none disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
          onClick={onContinue}
          type="button"
        >
          {isSubmitting ? (
            <svg
              className="text-loops-text h-6 w-6 animate-spin"
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
            <>
              <span>{ctaLabel}</span>
              <ChevronRight className="text-loops-text h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </AuthScreenWrapper>
  )
}

function AuthScreenWrapper({ children }: PropsWithChildren) {
  return (
    <div className="bg-loops-background flex min-h-screen w-full flex-col justify-center px-4 py-6">
      <div className="flex size-full flex-col items-start justify-center gap-y-10">
        {children}
      </div>
    </div>
  )
}

function RegisterSuccessScreen({
  credentials,
  redirect,
}: {
  credentials: RegisterCredentials
  redirect?: string
}) {
  const { t } = useTranslation()
  const { handleLogin } = useLogin()
  const { error: toastError } = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)

    const response = await handleLogin(
      ...buildRegisterSuccessLoginArgs(credentials, redirect),
    )

    if (response._tag === "Failure") {
      if (response.error.code === "invalid_credentials")
        toastError(t("auth.login.invalid_credentials"))
      else if (
        response.error.code === "user_password_not_set_or_invalid_provider"
      )
        toastError(t("auth.login.failed"), {
          description: t("auth.login.invalid_provider"),
        })
      else
        toastError(t("auth.login.failed"), {
          description: t("auth.login.unexpected_error"),
        })

      setIsSubmitting(false)
    }
  }

  return (
    <RegisterSuccessView
      backLabel={t("auth.register.success.back_label")}
      ctaLabel={t("auth.register.success.cta")}
      description={t("auth.register.success.description")}
      imageAlt={t("auth.register.success.image_alt")}
      isSubmitting={isSubmitting}
      onBack={() => {
        void router.navigate(getRegisterSuccessBackNavigation())
      }}
      onContinue={() => {
        void handleContinue()
      }}
      overline={t("auth.register.success.overline")}
      subtitle={t("auth.register.success.subtitle")}
    />
  )
}
