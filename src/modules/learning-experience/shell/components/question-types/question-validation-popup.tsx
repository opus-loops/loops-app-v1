import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "framer-motion"
import { useMemo } from "react"

import { Button } from "@/modules/shared/components/ui/button"
import { cn } from "@/modules/shared/lib/utils"
import { mascotLinks } from "@/modules/shared/utils/mascot-links"

type QuestionValidationPopupProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  variant: "correct" | "incorrect"
  subtitle?: string
}

// TODO: use shadcn component instead of custom radix dialog
export function QuestionValidationPopup({
  isOpen,
  onOpenChange,
  variant,
  subtitle,
}: QuestionValidationPopupProps) {
  const isCorrect = variant === "correct"

  const accentColor = isCorrect ? "#34c759" : "#ff383c"
  const dialogTitle = isCorrect ? "Excellent !" : "Not this time..."

  const mascotSrc = useMemo(() => {
    const mascotPool = isCorrect ? mascotLinks.happyLoo : mascotLinks.sadLoo
    const randomIndex = Math.floor(Math.random() * mascotPool.length)
    return mascotPool[randomIndex]
  }, [isCorrect])

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <AnimatePresence>
          {isOpen ? (
            <>
              <DialogPrimitive.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/80"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </DialogPrimitive.Overlay>

              <DialogPrimitive.Content asChild forceMount>
                <motion.div
                  className={cn(
                    "fixed bottom-0 left-1/2 z-50 w-[425px] max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-none border-0 bg-[#15153a] px-4 py-3 outline-none",
                    isCorrect && "shadow-[0_-4px_0_0_#34c759]",
                  )}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
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
                      onClick={() => onOpenChange(false)}
                      className="font-outfit w-full rounded-lg text-lg font-medium text-[#15153a]"
                      style={{ backgroundColor: accentColor }}
                      size="lg"
                    >
                      Continue
                    </Button>

                    {mascotSrc ? (
                      <img
                        alt={isCorrect ? "Happy mascot" : "Sad mascot"}
                        src={mascotSrc}
                        className="pointer-events-none absolute -top-20 right-0 h-[168px] w-[161px] -rotate-1 drop-shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
                        draggable={false}
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
