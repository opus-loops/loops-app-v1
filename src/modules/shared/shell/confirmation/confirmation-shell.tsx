import type { ReactNode } from "react"

import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import type { User } from "@/modules/shared/domain/entities/user"

import { ConfirmAccountForm } from "@/modules/account-management/features/account-confirmation/services"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"

import { LoadingScreen } from "../../components/common/loading-screen"
import { usePageLoading } from "../../hooks/use-page-loading"

const confirmationDialogOpenedSessionPrefix = "loops-confirmation-dialog-opened"
const twentyFourHoursInMs = 24 * 60 * 60 * 1000

type ConfirmationShellProps = { target: ReactNode; user: User }

export function ConfirmationShell({ target, user }: ConfirmationShellProps) {
  const { t } = useTranslation()
  const isLoading = usePageLoading()
  const [hasReachedDeadline, setHasReachedDeadline] = useState(() =>
    hasReachedConfirmationDeadline(user),
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const isConfirmed = isUserConfirmed(user)
  const isLocked = !isConfirmed && hasReachedDeadline
  const dialogOpenedKey = useMemo(
    () => getConfirmationDialogOpenedKey(user.userId),
    [user.userId],
  )

  useEffect(() => {
    if (isConfirmed) {
      setHasReachedDeadline(false)
      return
    }

    const remainingMs =
      user.createdAt.getTime() + twentyFourHoursInMs - Date.now()

    if (remainingMs <= 0) {
      setHasReachedDeadline(true)
      return
    }

    setHasReachedDeadline(false)

    const timeout = window.setTimeout(() => {
      setHasReachedDeadline(true)
    }, remainingMs)

    return () => window.clearTimeout(timeout)
  }, [isConfirmed, user.createdAt, user.userId])

  useEffect(() => {
    if (isConfirmed) {
      window.sessionStorage.removeItem(dialogOpenedKey)
      setIsDialogOpen(false)
      return
    }

    if (isLocked) {
      window.sessionStorage.setItem(dialogOpenedKey, "true")
      setIsDialogOpen(true)
      return
    }

    const hasOpenedThisSession =
      window.sessionStorage.getItem(dialogOpenedKey) === "true"

    if (hasOpenedThisSession) {
      setIsDialogOpen(false)
      return
    }

    window.sessionStorage.setItem(dialogOpenedKey, "true")
    setIsDialogOpen(true)
  }, [dialogOpenedKey, isConfirmed, isLocked])

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isLocked) return
    setIsDialogOpen(nextOpen)
  }

  if (isLoading) return <LoadingScreen />

  return (
    <>
      {target}

      {!isConfirmed ? (
        <Dialog onOpenChange={handleOpenChange} open={isDialogOpen}>
          <DialogContent
            className="bg-loops-background border-loops-gray/20 max-w-sm rounded-3xl border px-6 py-6 shadow-2xl"
            onEscapeKeyDown={(event) => {
              if (isLocked) event.preventDefault()
            }}
            onInteractOutside={(event) => {
              if (isLocked) event.preventDefault()
            }}
            onPointerDownOutside={(event) => {
              if (isLocked) event.preventDefault()
            }}
            showCloseButton={!isLocked}
          >
            <DialogHeader className="space-y-3 text-center">
              <DialogTitle className="font-outfit text-loops-pink text-center text-3xl font-bold tracking-tight">
                {t("auth.verify.dialog_title")}
              </DialogTitle>

              <DialogDescription className="font-outfit text-loops-light text-center text-base leading-6 font-medium">
                {t("auth.verify.dialog_description", { email: user.email })}
              </DialogDescription>
            </DialogHeader>

            <ConfirmAccountForm userId={user.userId} />
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  )
}

export function getConfirmationDialogOpenedKey(userId: string) {
  return `${confirmationDialogOpenedSessionPrefix}:${userId}`
}

export function hasReachedConfirmationDeadline(user: User, now = Date.now()) {
  if (isUserConfirmed(user)) return false

  return user.createdAt.getTime() + twentyFourHoursInMs <= now
}

export function isUserConfirmed(user: User) {
  return user.confirmationDate !== undefined
}
