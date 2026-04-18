import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"

import { useLogout } from "@/modules/authentication/features/login/services/use-logout"
import { useDeleteAccount } from "@/modules/profile/hooks/use-delete-account"
import { ExitIcon } from "@/modules/shared/components/icons/exit"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { OpenCategoriesButton } from "@/modules/shared/components/navigation/open-categories-button"
import { useToast } from "@/modules/shared/hooks/use-toast"

import type { DeleteAccountConfirmFormValues } from "./delete-account-confirm-dialog"

import { DeleteAccountConfirmDialog } from "./delete-account-confirm-dialog"
import { LogoutConfirmDialog } from "./logout-confirm-dialog"

// TODO: Refactor by splitting the component to respect SRP principle

type SettingsRowProps = {
  label: string
  onClick?: () => void
  to?: string
}

type SettingsScreenProps = {
  user: User
}

export function SettingsScreen({ user }: SettingsScreenProps) {
  const { handleDeleteAccount } = useDeleteAccount()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState(false)
  const { handleLogout } = useLogout()
  const { error: toastError } = useToast()
  const { t } = useTranslation()

  const deleteAccountForm = useForm({
    defaultValues: {} as DeleteAccountConfirmFormValues,
    onSubmit: async ({ value }) => {
      const response = await handleDeleteAccount(value.reason)

      if (response._tag === "Failure") {
        if (response.error.code === "Unauthorized") {
          setIsDeleteAccountDialogOpen(false)
          return
        }

        toastError(t("profile.delete_account_error_title"), {
          description: t("profile.delete_account_error_description"),
        })
        return
      }

      deleteAccountForm.reset()
      setIsDeleteAccountDialogOpen(false)
    },
  })

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
          <SettingsRow
            label={t("profile.logout")}
            onClick={() => setIsLogoutDialogOpen(true)}
          />
        </div>

        <div className="mt-auto pt-10">
          <button
            aria-label={t("profile.delete_account")}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#ff6265] bg-transparent px-4 py-3 text-[#ff6265] transition-colors hover:bg-[#ff6265]/10 focus-visible:ring-2 focus-visible:ring-[#ff6265]/40 focus-visible:outline-none"
            onClick={() => setIsDeleteAccountDialogOpen(true)}
            type="button"
          >
            <div className="h-6 w-6">
              <ExitIcon />
            </div>
            <span className="text-base font-medium">
              {t("profile.delete_account")}
            </span>
          </button>

          <LogoutConfirmDialog
            onConfirmLogout={async () => {
              await handleLogout()
            }}
            onOpenChange={setIsLogoutDialogOpen}
            open={isLogoutDialogOpen}
          />

          <DeleteAccountConfirmDialog
            isSubmitting={deleteAccountForm.state.isSubmitting}
            onOpenChange={(open) => {
              setIsDeleteAccountDialogOpen(open)

              if (!open) {
                deleteAccountForm.reset()
              }
            }}
            onReasonBlur={() => {
              deleteAccountForm.setFieldMeta("reason", (prev) => ({
                ...prev,
                isTouched: true,
              }))
            }}
            onReasonChange={(value) => {
              deleteAccountForm.setFieldValue("reason", value)
            }}
            onSubmit={() => {
              void deleteAccountForm.handleSubmit()
            }}
            open={isDeleteAccountDialogOpen}
            reason={deleteAccountForm.state.values.reason}
          />
        </div>
      </div>
    </div>
  )
}

function SettingsRow({ label, onClick, to }: SettingsRowProps) {
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
      onClick={onClick}
      type="button"
    >
      {content}
    </button>
  )
}
