import { motion } from "framer-motion"
import { CheckCircle2, ChevronLeft, X } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { DialogClose, DialogTitle } from "@/modules/shared/components/ui/dialog"

import { useGetVoucherRequest } from "../services/use-get-voucher-request"
import { VoucherRequestAction } from "./voucher-request-action"
import { VoucherSubmissionForm } from "./voucher-submission-form"

type VoucherStepperVoucherStepProps = {
  categoryId: string
  onBack: () => void
  onSuccess: () => void
}

export function VoucherStepperVoucherStep({
  categoryId,
  onBack,
  onSuccess,
}: VoucherStepperVoucherStepProps) {
  const { t } = useTranslation()
  const { voucherRequest } = useGetVoucherRequest({ categoryId })

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
      exit={{ opacity: 0, y: 10 }}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <div className="mb-6 grid grid-cols-[40px_1fr_40px] items-center gap-3">
        <Button
          className="text-loops-light/70 hover:bg-loops-light/10 hover:text-loops-light rounded-full"
          onClick={onBack}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">{t("common.back")}</span>
        </Button>

        <div className="flex justify-center">
          <div className="bg-loops-light/10 inline-flex items-center justify-center rounded-full px-3 py-1">
            <span className="font-outfit text-loops-light text-xs font-semibold">
              {t("voucher.dialog.step_badge", {
                current: 2,
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
        onSuccess={onSuccess}
        submitLabelKey="voucher.form.submit_code"
      />
      {voucherRequest && voucherRequest.status === "pending" && (
        <div className="border-loops-correct/30 bg-loops-correct/10 mt-2 flex items-start gap-3 rounded-xl border p-4">
          <CheckCircle2
            aria-hidden
            className="text-loops-correct mt-0.5 size-5 shrink-0"
          />
          <div className="space-y-1 text-start">
            <p className="font-outfit text-loops-correct text-sm font-semibold">
              {t("voucher.request.already_sent_title")}
            </p>
            <p className="font-outfit text-loops-light/80 text-sm leading-5">
              {t("voucher.request.already_sent_description")}
            </p>
          </div>
        </div>
      )}

      {!voucherRequest && <VoucherRequestAction categoryId={categoryId} />}
    </motion.div>
  )
}
