import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { KeyIcon } from "@/modules/shared/components/icons/key"
import { RocketIcon } from "@/modules/shared/components/icons/rocket"
import { Button } from "@/modules/shared/components/ui/button"
import {
  DialogClose,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"

const freeTrialIconClassName = "size-10 text-loops-warning shrink-0 grow-0"
const voucherIconClassName = "size-10 text-loops-pink shrink-0 grow-0"

type VoucherStepperSelectionStepProps = {
  isStartingFreeTrial: boolean
  onContinueWithVoucher: () => void
  onStartFreeTrial: () => void
}

export function VoucherStepperSelectionStep({
  isStartingFreeTrial,
  onContinueWithVoucher,
  onStartFreeTrial,
}: VoucherStepperSelectionStepProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
      exit={{ opacity: 0, y: -10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mb-6 grid grid-cols-[40px_1fr_40px] items-center gap-3">
        <div aria-hidden className="size-8" />

        <div className="flex justify-center">
          <div className="bg-loops-light/10 inline-flex items-center justify-center rounded-full px-3 py-1">
            <span className="font-outfit text-loops-light text-xs font-semibold">
              {t("voucher.dialog.step_badge", {
                current: 1,
                total: 2,
              })}
            </span>
          </div>
        </div>

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
      </div>

      <DialogHeader className="text-center">
        <DialogTitle className="font-outfit text-loops-info text-center text-2xl leading-tight font-bold">
          {t("voucher.dialog.unlock_method_title")}
        </DialogTitle>
      </DialogHeader>

      <div className="border-loops-gray/20 bg-loops-light/5 space-y-4 rounded-3xl border p-4">
        <div className="flex items-start gap-3">
          <div className={voucherIconClassName}>
            <KeyIcon />
          </div>

          <div className="space-y-1">
            <p className="font-outfit text-loops-pink text-lg font-semibold">
              {t("voucher.dialog.voucher_title")}
            </p>
            <p className="font-outfit text-loops-light text-sm leading-5">
              {t("voucher.dialog.voucher_description")}
            </p>
          </div>
        </div>

        <Button
          className="font-outfit text-loops-text hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-6 text-base leading-5 font-semibold capitalize shadow-none transition-all duration-200"
          onClick={onContinueWithVoucher}
          type="button"
        >
          {t("voucher.dialog.enter_my_code")}
        </Button>
      </div>

      <div className="bg-loops-gray/20 h-px w-full" />

      <div className="border-loops-gray/20 bg-loops-light/5 space-y-4 rounded-3xl border p-4">
        <div className="flex items-start gap-3">
          <div className={freeTrialIconClassName}>
            <RocketIcon />
          </div>

          <div className="space-y-1">
            <p className="font-outfit text-loops-warning text-lg font-semibold">
              {t("voucher.dialog.free_trial_title")}
            </p>
            <p className="font-outfit text-loops-light text-sm leading-5">
              {t("voucher.dialog.free_trial_description")}
            </p>
          </div>
        </div>

        <Button
          className="font-outfit text-loops-light border-loops-light/20 w-full rounded-xl border-2 bg-transparent py-6 text-base leading-5 font-semibold capitalize transition-all duration-200 hover:bg-white/5"
          disabled={isStartingFreeTrial}
          onClick={onStartFreeTrial}
          type="button"
        >
          {isStartingFreeTrial
            ? t("voucher.dialog.starting")
            : t("voucher.dialog.start_free_trial")}
        </Button>
      </div>
    </motion.div>
  )
}
