import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { Textarea } from "@/modules/shared/components/ui/textarea"
import { cn } from "@/modules/shared/lib/utils"

const cryingLoopsUrl = "/images/crying-loops.png"

export type DeleteAccountConfirmFormValues = {
  reason: string
}

type DeleteAccountConfirmDialogProps = {
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onReasonBlur: () => void
  onReasonChange: (value: string) => void
  onSubmit: () => void
  open: boolean
  reason: string
}

export function DeleteAccountConfirmDialog({
  isSubmitting,
  onOpenChange,
  onReasonBlur,
  onReasonChange,
  onSubmit,
  open,
  reason,
}: DeleteAccountConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <DialogPrimitive.Root
      onOpenChange={(nextOpen) => {
        if (isSubmitting) return
        onOpenChange(nextOpen)
      }}
      open={open}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 max-h-[calc(100vh-2rem)] w-[344px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto",
            "bg-loops-background rounded-3xl px-6 py-7 shadow-lg outline-none",
          )}
        >
          <form
            className="flex flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onSubmit()
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <DialogPrimitive.Title className="text-center text-2xl font-semibold text-[#ff8d4d]">
                {t("profile.delete_account_confirm.title")}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-center text-sm leading-6 text-white/80">
                {t("profile.delete_account_confirm.description_line_1")}
                <br />
                {t("profile.delete_account_confirm.description_line_2")}
              </DialogPrimitive.Description>
            </div>

            <img
              alt={t("profile.delete_account_confirm.mascot_alt")}
              className="mx-auto h-[180px] w-[180px] object-contain select-none"
              draggable={false}
              src={cryingLoopsUrl}
            />

            <div className="flex flex-col gap-3">
              <label
                className="text-loops-light text-sm font-medium"
                htmlFor="delete-account-reason"
              >
                {t("profile.delete_account_confirm.reason_label")}
              </label>
              <Textarea
                className="min-h-28 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-base text-white shadow-none placeholder:text-white/45 focus-visible:border-[#ff6265] focus-visible:ring-[#ff6265]/25"
                disabled={isSubmitting}
                id="delete-account-reason"
                maxLength={500}
                name="delete-account-reason"
                onBlur={onReasonBlur}
                onChange={(event) => onReasonChange(event.target.value)}
                placeholder={t("profile.delete_account_confirm.placeholder")}
                value={reason}
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="bg-loops-cyan hover:bg-loops-cyan/90 min-h-12 rounded-xl text-base font-semibold text-[#15153a] shadow-none"
                disabled={isSubmitting}
                onClick={() => onOpenChange(false)}
                size="lg"
                type="button"
              >
                {t("profile.delete_account_confirm.cancel")}
              </Button>

              <Button
                className="min-h-12 rounded-xl border border-[#ff6265] bg-transparent text-base font-semibold text-[#ff6265] shadow-none hover:bg-[#ff6265]/10"
                disabled={isSubmitting}
                size="lg"
                type="submit"
                variant="outline"
              >
                {isSubmitting ? (
                  <svg
                    className="h-5 w-5 animate-spin text-[#ff6265]"
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
                ) : null}
                <span>{t("profile.delete_account_confirm.confirm")}</span>
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
