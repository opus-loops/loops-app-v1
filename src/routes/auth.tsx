import type { PropsWithChildren } from "react"

import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { LoginGoogle } from "@/modules/authentication/features/login/components/login-google"
import { LoginForm } from "@/modules/authentication/features/login/services/login-form"
import { RegisterScreen } from "@/modules/authentication/features/register/components/register-screen"
import { SelectorScreen } from "@/modules/authentication/features/selector/components/selector-screen"
import {
  authSearchSchema,
  buildAuthSearch,
} from "@/modules/authentication/lib/auth-search"
import { isAuthenticated } from "@/modules/shared/guards/is-authenticated"
import { FirstInstallShell } from "@/modules/shared/shell/first_install/first-install"

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const response = await isAuthenticated()
    if (response._tag === "Success") {
      throw redirect({ to: "/" })
    }
  },
  component: function Auth() {
    return <FirstInstallShell target={<AuthScreen />} />
  },
  validateSearch: authSearchSchema,
})

export function LoginScreen({ redirect }: { redirect?: string }) {
  const { t } = useTranslation()
  const redirectProps = redirect ? { redirect } : {}

  return (
    <AuthWrapper>
      <h2 className="font-outfit text-loops-pink text-center text-3xl leading-5 font-bold tracking-tight wrap-break-word">
        {t("auth.login.title")}
      </h2>

      <LoginForm {...redirectProps} />

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
          search={buildAuthSearch("register", redirect)}
          to="/auth"
        >
          {t("auth.login.no_account")}{" "}
          <span className="text-loops-cyan">{t("auth.login.sign_up")}</span>
        </Link>
      </div>
    </AuthWrapper>
  )
}

function AuthScreen() {
  const { redirect, screen } = Route.useSearch()
  const selectorProps = redirect ? { redirect } : {}

  if (screen === "login")
    if (redirect) return <LoginScreen redirect={redirect} />
    else <LoginScreen />

  if (screen === "register")
    if (redirect) return <RegisterScreen redirect={redirect} />
    else if (!redirect) return <RegisterScreen />

  return <SelectorScreen {...selectorProps} />
}

function AuthWrapper({ children }: PropsWithChildren) {
  return (
    <div className="bg-loops-background flex min-h-screen w-full flex-col justify-center px-4 py-6">
      <div className="flex size-full flex-col items-start justify-center gap-y-10">
        {children}
      </div>
    </div>
  )
}
