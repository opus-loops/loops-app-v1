import { Link } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { ShieldTickIcon } from "@/modules/shared/components/icons/shield-tick"

export function ResetPasswordSuccessPanel() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-6 py-8 text-center">
      <div className="text-loops-info size-32 shrink-0 grow-0">
        <ShieldTickIcon />
      </div>

      <div className="mt-6 flex w-full flex-col items-center gap-y-3">
        <h2 className="font-outfit text-loops-light text-center text-3xl leading-tight font-bold tracking-tight wrap-break-word">
          {t("auth.reset_password.success_title")}
        </h2>
        <p className="font-outfit text-loops-light text-center text-base leading-7 font-medium tracking-tight">
          {t("auth.reset_password.success_description")}
        </p>
      </div>

      <Link
        className="font-outfit text-loops-text hover:bg-loops-info bg-loops-cyan mt-8 w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
        search={buildAuthSearch("login")}
        to="/auth"
      >
        {t("auth.register.sign_in")}
      </Link>
    </div>
  )
}
