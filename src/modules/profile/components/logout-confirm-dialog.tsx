import cryingLoopsUrl from "../../../../assets/images/crying-loops.png"

import { ExitIcon } from "@/modules/shared/components/icons/exit"
import { cn } from "@/modules/shared/lib/utils"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useCallback, useState } from "react"

type LogoutConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmLogout: () => Promise<void> | void
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirmLogout,
}: LogoutConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const handleQuit = useCallback(async () => {
    setIsLoading(true)
    try {
      await onConfirmLogout()
    } finally {
      setIsLoading(false)
      onOpenChange(false)
    }
  }, [onConfirmLogout, onOpenChange])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[344px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "bg-loops-background flex h-[591px] flex-col items-center justify-center gap-8 rounded-3xl px-6 py-8 shadow-lg outline-none",
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <DialogPrimitive.Title className="text-loops-orange text-center text-2xl leading-[34px] font-semibold">
              Encore un petit effort !
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-loops-orange text-center text-base leading-[22px]">
              Tu es super proche d’avancer !
              <br /> Si tu quittes maintenant, tu perds ta progression.&nbsp;
            </DialogPrimitive.Description>
          </div>

          <img
            src={cryingLoopsUrl}
            alt="Crying Loops mascot"
            className="h-[227px] w-[224px] object-contain select-none"
            draggable={false}
          />

          <div className="flex w-full flex-col gap-4 px-5">
            <p className="text-loops-cyan text-center text-2xl leading-[34px] font-semibold">
              On continue ?
            </p>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleContinue}
              className="bg-loops-cyan inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-[18px] leading-[30px] font-medium text-[#15153a] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuer
            </button>

            <button
              type="button"
              disabled={isLoading}
              onClick={handleQuit}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2 text-[18px] leading-[30px] font-medium text-[#ff383c] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <svg
                  className="h-6 w-6 animate-spin text-[#ff383c]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
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
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <>
                  <span>Quitter</span>
                  <span className="h-6 w-6">
                    <ExitIcon />
                  </span>
                </>
              )}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
