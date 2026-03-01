import { Button } from "@/modules/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/modules/shared/components/ui/dialog"
import { AnimatePresence, motion } from "framer-motion"
import { useRef, useState } from "react"
import { VoucherSubmissionForm } from "./voucher-submission-form"

type VoucherDialogProps = {
  categoryId: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
export function VoucherDialog({
  categoryId,
  open: externalOpen,
  onOpenChange,
}: VoucherDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Use external open state if provided, otherwise use internal state
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild ref={triggerRef}>
        <Button className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200">
          Start now
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-loops-background border-loops-gray/20 max-w-sm rounded-3xl border p-0 shadow-2xl">
        <AnimatePresence>
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
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
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                delay: 0.1,
                duration: 0.3,
                ease: "easeOut",
              }}
              className="flex flex-col items-center px-6 py-6"
            >
              {/* Icon */}
              <motion.div
                className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                }}
              >
                <motion.svg
                  className="text-loops-light h-10 w-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4, duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </motion.svg>
              </motion.div>

              {/* Title */}
              <DialogHeader className="mb-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <DialogTitle className="text-loops-light text-lg font-bold">
                    Unlock Category
                  </DialogTitle>
                </motion.div>
              </DialogHeader>

              {/* Description */}
              <motion.p
                className="text-loops-light/80 font-outfit mb-6 text-center text-sm leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                Enter your voucher code to unlock this category and start your
                learning journey!
              </motion.p>

              {/* Form */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <VoucherSubmissionForm
                  categoryId={categoryId}
                  onSuccess={() => setOpen(false)}
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
