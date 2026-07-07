import { AnimatePresence, motion } from "framer-motion"
import { Suspense, useState } from "react"
import { useTranslation } from "react-i18next"

import { useStartCategory } from "@/modules/content-management/features/category-selection/hooks/use-start-category"
import { Button } from "@/modules/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/modules/shared/components/ui/dialog"

import { VoucherStepperSelectionStep } from "./voucher-stepper-selection-step"
import { VoucherStepperVoucherStep } from "./voucher-stepper-voucher-step"

type FreeTrialDialogStep = "selection" | "voucher"

type VoucherStepperDialogProps = {
  categoryId: string
  onOpenChange?: (open: boolean) => void
  open?: boolean
  showTrigger?: boolean
}

export function VoucherStepperDialog({
  categoryId,
  onOpenChange,
  open: externalOpen,
}: VoucherStepperDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [currentStep, setCurrentStep] =
    useState<FreeTrialDialogStep>("selection")
  const [isStartingFreeTrial, setIsStartingFreeTrial] = useState(false)
  const { handleStartCategory } = useStartCategory()
  const { t } = useTranslation()

  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange ?? setInternalOpen

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setCurrentStep("selection")
    setOpen(nextOpen)
  }

  const closeDialog = () => handleOpenChange(false)

  const handleStartFreeTrial = async () => {
    setIsStartingFreeTrial(true)
    const response = await handleStartCategory(categoryId)
    setIsStartingFreeTrial(false)

    if (response._tag === "Success") closeDialog()
  }

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogTrigger asChild>
        <Button className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200">
          {t("voucher.dialog.start_now")}
        </Button>
      </DialogTrigger>

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
              {currentStep === "selection" ? (
                <VoucherStepperSelectionStep
                  isStartingFreeTrial={isStartingFreeTrial}
                  onContinueWithVoucher={() => setCurrentStep("voucher")}
                  onStartFreeTrial={handleStartFreeTrial}
                />
              ) : (
                <Suspense
                  fallback={
                    <p className="font-outfit text-loops-light mt-2 text-center text-sm">
                      {t("voucher.request.loading")}
                    </p>
                  }
                >
                  <VoucherStepperVoucherStep
                    categoryId={categoryId}
                    onBack={() => setCurrentStep("selection")}
                    onSuccess={closeDialog}
                  />
                </Suspense>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
