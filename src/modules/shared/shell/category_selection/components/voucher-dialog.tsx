import { AnimatePresence, motion } from "framer-motion"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { useStartCategory } from "@/modules/content-management/features/category-selection/hooks/use-start-category"
import { Button } from "@/modules/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/dialog"

import { VoucherSubmissionForm } from "./voucher-submission-form"

type VoucherDialogProps = {
  categoryId: string
  description?: string
  onOpenChange?: (open: boolean) => void
  open?: boolean
  showFreeTrial?: boolean
  showTrigger?: boolean
  title?: string
}
export function VoucherDialog({
  categoryId,
  description,
  onOpenChange,
  open: externalOpen,
  showFreeTrial = true,
  showTrigger = true,
  title,
}: VoucherDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { t } = useTranslation()

  const dialogTitle = title || t("voucher.dialog.default_title")
  const dialogDescription =
    description || t("voucher.dialog.default_description")

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  const { handleStartCategory } = useStartCategory()
  const [isStartingFreeTrial, setIsStartingFreeTrial] = useState(false)

  const onStartFreeTrial = async () => {
    setIsStartingFreeTrial(true)
    const response = await handleStartCategory(categoryId)
    setIsStartingFreeTrial(false)
    if (response._tag === "Success") setOpen(false)
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      {showTrigger ? (
        <DialogTrigger asChild ref={triggerRef}>
          <Button className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200">
            {t("voucher.dialog.start_now")}
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="bg-loops-background border-loops-gray/20 max-w-sm rounded-3xl border p-0 shadow-2xl">
        <AnimatePresence>
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
            transition={{
              damping: 30,
              stiffness: 300,
              type: "spring",
            }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center px-6 py-6"
              exit={{ opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut",
              }}
            >
              {/* Icon */}
              <motion.div
                animate={{ rotate: 0, scale: 1 }}
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
                exit={{ rotate: 180, scale: 0 }}
                initial={{ rotate: -180, scale: 0 }}
                transition={{
                  damping: 20,
                  delay: 0.2,
                  stiffness: 200,
                  type: "spring",
                }}
              >
                <motion.svg
                  animate={{ opacity: 1 }}
                  className="text-loops-light h-10 w-10"
                  exit={{ opacity: 0 }}
                  fill="none"
                  initial={{ opacity: 0 }}
                  stroke="currentColor"
                  transition={{ delay: 0.4, duration: 0.2 }}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </motion.svg>
              </motion.div>

              {/* Title */}
              <DialogHeader className="mb-4 text-center">
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <DialogTitle className="text-loops-light text-lg font-bold">
                    {dialogTitle}
                  </DialogTitle>
                </motion.div>
              </DialogHeader>

              {/* Description */}
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="text-loops-light/80 font-outfit mb-6 text-center text-sm leading-relaxed"
                exit={{ opacity: 0, y: -20 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                {dialogDescription}
              </motion.p>

              {/* Form */}
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
                exit={{ opacity: 0, y: 30 }}
                initial={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <VoucherSubmissionForm
                  categoryId={categoryId}
                  onSuccess={() => setOpen(false)}
                />

                {showFreeTrial ? (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/10" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-loops-background text-loops-light/50 px-2 font-medium">
                          {t("voucher.dialog.or")}
                        </span>
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
                  </>
                ) : null}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
