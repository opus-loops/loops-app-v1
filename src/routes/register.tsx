import { createFileRoute, Link, redirect } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { LoginGoogle } from "@/modules/authentication/features/login/components/login-google"
import { RegisterForm } from "@/modules/authentication/features/register/components/register-form"
import { isAuthenticated } from "@/modules/shared/guards/is-authenticated"
import { FirstInstallShell } from "@/modules/shared/shell/first_install/first-install"

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const response = await isAuthenticated()
    if (response._tag === "Success") {
      throw redirect({ to: "/" })
    }
  },
  component: function Register() {
    return <FirstInstallShell target={<RegisterScreen />} />
  },
})

function RegisterScreen() {
  const { t } = useTranslation()

  return (
    <div className="bg-loops-background min-h-screen w-full px-4 py-6">
      <div className="flex size-full flex-col items-start justify-center gap-y-10">
        <h2 className="font-outfit text-loops-cyan text-center text-3xl leading-5 font-bold tracking-tight break-words">
          {t("auth.register.title")}
        </h2>

        <RegisterForm />

        <div className="flex w-full items-center gap-x-4">
          <div className="bg-loops-gray h-px flex-1" />
          <span className="text-loops-gray font-outfit text-base leading-5 font-normal">
            or
          </span>
          <div className="bg-loops-gray h-px flex-1" />
        </div>

        <div className="flex w-full flex-col items-center gap-y-10">
          <div className="flex w-full flex-col items-center gap-y-5">
            <LoginGoogle />
          </div>
          <Link
            className="text-loops-white font-outfit text-center text-sm leading-6 font-medium tracking-tight"
            to="/login"
          >
            {t("auth.register.have_account")}{" "}
            <span className="text-loops-cyan">
              {t("auth.register.sign_in")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
