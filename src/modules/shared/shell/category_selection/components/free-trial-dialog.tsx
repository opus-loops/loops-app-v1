import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/dialog"

import { VoucherSubmissionForm } from "./voucher-submission-form"

type FreeTrialDialogProps = {
  categoryId: string
  onOpenChange?: (open: boolean) => void
  open?: boolean
  showTrigger?: boolean
}

type FreeTrialDialogStep = "selection" | "voucher"

export function FreeTrialDialog({
  categoryId,
  onOpenChange,
  open: externalOpen,
  showTrigger = false,
}: FreeTrialDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [currentStep, setCurrentStep] =
    useState<FreeTrialDialogStep>("selection")
  const { t } = useTranslation()

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setCurrentStep("selection")
    setOpen(nextOpen)
  }

  const closeDialog = () => handleOpenChange(false)

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      {showTrigger ? (
        <DialogTrigger asChild>
          <Button className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200">
            {t("voucher.dialog.start_now")}
          </Button>
        </DialogTrigger>
      ) : null}

      <DialogContent
        className="bg-loops-background border-loops-gray/20 max-w-sm rounded-3xl border p-0 shadow-2xl"
        showCloseButton={false}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            key={currentStep}
            transition={{
              damping: 30,
              stiffness: 300,
              type: "spring",
            }}
          >
            <div className="px-6 py-6">
              <div className="flex justify-end">
                <DialogClose asChild>
                  <button
                    aria-label={t("voucher.dialog.close")}
                    className="text-loops-light/70 hover:bg-loops-light/10 hover:text-loops-light inline-flex size-8 items-center justify-center rounded-full transition-colors"
                    type="button"
                  >
                    <X className="size-5" />
                    <span className="sr-only">{t("voucher.dialog.close")}</span>
                  </button>
                </DialogClose>
              </div>

              <div className="mb-6 space-y-4 text-center">
                <img
                  alt={t("voucher.dialog.step_two_image_alt")}
                  className="mx-auto h-auto w-full max-w-56"
                  src="/images/loops-voucher.png"
                />
                <DialogTitle className="font-outfit text-loops-pink text-center text-2xl leading-tight font-bold tracking-tight">
                  {t("voucher.dialog.step_two_title")}
                </DialogTitle>
              </div>

              <VoucherSubmissionForm
                categoryId={categoryId}
                onSuccess={closeDialog}
                submitLabelKey={t("voucher.form.submit_code")}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
