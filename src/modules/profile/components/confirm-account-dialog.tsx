import { useTranslation } from "react-i18next"

import { ConfirmAccountForm } from "@/modules/account-management/features/account-confirmation/services/confirm-account-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"

type ConfirmAccountDialogProps = {
  email: string
  onOpenChange: (open: boolean) => void
  open: boolean
  userId: string
}

export function ConfirmAccountDialog({
  email,
  onOpenChange,
  open,
  userId,
}: ConfirmAccountDialogProps) {
  const { t } = useTranslation()

  const handleSuccess = () => {
    onOpenChange(false)
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="bg-loops-background border-loops-gray/20 max-w-sm rounded-3xl border px-6 py-6 shadow-2xl">
        <DialogHeader className="space-y-3 text-center">
          <DialogTitle className="font-outfit text-loops-pink text-center text-3xl font-bold tracking-tight">
            {t("auth.verify.dialog_title")}
          </DialogTitle>

          <DialogDescription className="font-outfit text-loops-light text-center text-base leading-6 font-medium">
            {t("auth.verify.dialog_description", { email })}
          </DialogDescription>
        </DialogHeader>

        <ConfirmAccountForm onSuccess={handleSuccess} userId={userId} />
      </DialogContent>
    </Dialog>
  )
}
