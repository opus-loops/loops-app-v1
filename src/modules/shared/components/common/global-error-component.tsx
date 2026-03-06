import * as DialogPrimitive from "@radix-ui/react-dialog"
import { captureException } from "@sentry/tanstackstart-react"
import { useRouter } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"
import { cn } from "@/modules/shared/lib/utils"

interface GlobalErrorComponentProps {
  error: Error
  reset: () => void
}

export function GlobalErrorComponent({
  error,
  reset,
}: GlobalErrorComponentProps) {
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    captureException(error)
  }, [error])

  const handleReset = () => {
    reset()
    router.invalidate()
  }

  const handleGoHome = () => {
    window.location.href = "/"
  }

  return (
    <DialogPrimitive.Root open={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-50 w-[344px] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2",
            "bg-loops-background flex flex-col items-center justify-center gap-8 rounded-3xl px-6 py-8 shadow-lg outline-none",
          )}
        >
          <div className="flex flex-col items-center gap-4">
            <DialogPrimitive.Title className="text-loops-orange text-center text-2xl leading-[34px] font-semibold">
              {t("common.unexpected_error")}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-loops-orange text-center text-base leading-[22px]">
              {/* Show a friendly message, maybe obscure the technical error if needed */}
              {t("common.error")}
            </DialogPrimitive.Description>
          </div>

          <img
            alt="Crying Loops mascot"
            className="h-[227px] w-[224px] object-contain select-none"
            draggable={false}
            src="/images/crying-loops.png"
          />

          <div className="flex w-full flex-col gap-4 px-5">
            <Button
              className="bg-loops-cyan hover:bg-loops-cyan/90 w-full text-lg font-medium text-[#15153a]"
              onClick={handleReset}
            >
              {t("common.try_again")}
            </Button>
            <Button
              className="w-full text-lg font-medium"
              onClick={handleGoHome}
              variant="outline"
            >
              {t("common.home")}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
