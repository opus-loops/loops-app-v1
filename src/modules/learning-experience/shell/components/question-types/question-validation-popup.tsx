import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { cn } from "@/modules/shared/lib/utils"
import { mascotLinks } from "@/modules/shared/utils/mascot-links"

type QuestionValidationPopupProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  subtitle?: string
  variant: "correct" | "incorrect" | "time-up"
}

// TODO: use shadcn component instead of custom radix dialog
export function QuestionValidationPopup({
  isOpen,
  onOpenChange,
  subtitle,
  variant,
}: QuestionValidationPopupProps) {
  const { t } = useTranslation()
  const isCorrect = variant === "correct"
  const isTimeUp = variant === "time-up"

  const accentColor = isCorrect ? "#34c759" : isTimeUp ? "#ff9500" : "#ff383c"
  const dialogTitle = isCorrect
    ? "Excellent !"
    : isTimeUp
      ? t("quiz.validation.time_up")
      : "Not this time..."

  const mascotSrc = useMemo(() => {
    const mascotPool = isCorrect ? mascotLinks.happyLoo : mascotLinks.sadLoo
    const randomIndex = Math.floor(Math.random() * mascotPool.length)
    return mascotPool[randomIndex]
  }, [isCorrect])

  return (
    <DialogPrimitive.Root onOpenChange={onOpenChange} open={isOpen}>
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {isOpen ? (
            <>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-50 bg-black/80"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    "fixed bottom-0 left-1/2 z-50 w-[425px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-none border-0 bg-[#15153a] px-4 py-3 outline-none",
                    isCorrect && "shadow-[0_-4px_0_0_#34c759]",
                  )}
                  exit={{ opacity: 0, scale: 0.98, y: 24 }}
                  initial={{ opacity: 0, scale: 0.98, y: 24 }}
                  transition={{ damping: 28, stiffness: 320, type: "spring" }}
                >
                  <div className="relative flex flex-col items-center justify-center gap-4">
                    <div className="font-outfit w-full text-left font-bold">
                      <div
                        className="text-2xl leading-[30px] whitespace-pre-line"
                        style={{ color: accentColor }}
                      >
                        {dialogTitle}
                      </div>
                      {subtitle ? (
                        <div
                          className="max-w-[250px] text-base leading-[30px] whitespace-pre-line"
                          style={{ color: accentColor }}
                        >
                          {subtitle}
                        </div>
                      ) : null}
                    </div>

                    <Button
                      className="font-outfit w-full rounded-lg text-lg font-medium text-[#15153a]"
                      onClick={() => onOpenChange(false)}
                      size="lg"
                      style={{ backgroundColor: accentColor }}
                    >
                      Continue
                    </Button>

                    {mascotSrc ? (
                      <img
                        alt={isCorrect ? "Happy mascot" : "Sad mascot"}
                        className="pointer-events-none absolute -top-20 right-0 h-[168px] w-[161px] -rotate-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
                        draggable={false}
                        src={mascotSrc}
                      />
                    ) : null}
                  </div>
                </motion.div>
              </DialogPrimitive.Content>
            </>
          ) : null}
        </AnimatePresence>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
