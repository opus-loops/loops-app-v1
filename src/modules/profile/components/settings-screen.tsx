import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { LogoutConfirmDialog } from "./logout-confirm-dialog"
import type { User } from "@/modules/shared/domain/entities/user"

import { useLogout } from "@/modules/authentication/features/login/services/use-logout"
import { ExitIcon } from "@/modules/shared/components/icons/exit"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { OpenCategoriesButton } from "@/modules/shared/components/navigation/open-categories-button"

type SettingsRowProps = {
  label: string
  to?: string
}

type SettingsScreenProps = {
  user: User
}

export function SettingsScreen({ user }: SettingsScreenProps) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const { handleLogout } = useLogout()
  const { t } = useTranslation()

  return (
    <div className="bg-loops-background w-full">
      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-5 pt-10 pb-28">
        <div className="grid grid-cols-3 items-center">
          <div className="flex items-center">
            <OpenCategoriesButton
              className="h-11 w-11 rounded-xl bg-[#1f4b6682] shadow-lg backdrop-blur-sm hover:bg-[#1f4b66aa]"
              search={{ category: "all" }}
              to="/profile/settings"
            />
          </div>

          <h1 className="text-loops-light text-center text-xl font-semibold">
            {t("profile.settings_title")}
          </h1>

          <div />
        </div>

        <div className="mt-8 flex items-start gap-4 px-1">
          {user.avatarURL ? (
            <img
              alt={user.fullName}
              className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
              src={user.avatarURL}
            />
          ) : (
            <div className="bg-loops-pink flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full">
              <div className="text-loops-light h-9 w-9">
                <UserIcon />
              </div>
            </div>
          )}

          <div className="pt-3">
            <p className="text-loops-light text-2xl font-semibold">
              {user.fullName}
            </p>
            <p className="text-loops-light mt-1 text-sm font-medium opacity-80">
              {t("profile.edit_profile")}
            </p>
          </div>
        </div>

        <h2 className="text-loops-light mt-8 px-1 text-2xl font-bold">
          {t("profile.settings_title")}
        </h2>

        <div className="mt-8 flex flex-col gap-4">
          <SettingsRow
            label={t("profile.edit_profile")}
            to="/profile/settings/edit-profile"
          />
          <SettingsRow
            label={t("profile.security")}
            to="/profile/settings/security"
          />
          <SettingsRow
            label={t("profile.preferences")}
            to="/profile/settings/preferences"
          />
        </div>

        <div className="mt-auto pt-10">
          <button
            aria-label={t("profile.logout")}
            className="flex items-center gap-3 px-1 text-[#ff3b3b]"
            onClick={() => setIsLogoutDialogOpen(true)}
            type="button"
          >
            <div className="h-6 w-6">
              <ExitIcon />
            </div>
            <span className="text-base font-medium">{t("profile.logout")}</span>
          </button>

          <LogoutConfirmDialog
            onConfirmLogout={async () => {
              await handleLogout()
            }}
            onOpenChange={setIsLogoutDialogOpen}
            open={isLogoutDialogOpen}
          />
        </div>
      </div>
    </div>
  )
}

function SettingsRow({ label, to }: SettingsRowProps) {
  const content = (
    <>
      <span className="text-loops-light text-base font-medium">{label}</span>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
        <ChevronRight className="h-4 w-4 text-[#000016]" />
      </span>
    </>
  )

  if (to) {
    return (
      <Link
        className="flex w-full items-center justify-between px-2 py-2 text-left"
        to={to}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      className="flex w-full items-center justify-between px-2 py-2 text-left"
      type="button"
    >
      {content}
    </button>
  )
}
