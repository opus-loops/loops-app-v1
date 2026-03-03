import * as DialogPrimitive from "@radix-ui/react-dialog"
import { useRouter } from "@tanstack/react-router"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/modules/shared/lib/utils"

interface SessionExpiredDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function SessionExpiredDialog({
  isOpen,
  onClose,
}: SessionExpiredDialogProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onClose()

          const pathname = window.location.pathname
          const search = window.location.search
          const hash = window.location.hash

          const redirectTo = `${pathname}${search}${hash}`

          router.navigate({
            search: { redirect: redirectTo },
            to: "/login",
          })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, onClose, router])

  // Reset countdown when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCountdown(3)
    }
  }, [isOpen])

  const handleLoginRedirect = () => {
    onClose()
    const redirectTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
    router.navigate({
      search: { redirect: redirectTo },
      to: "/login",
    })
  }

  return (
    <DialogPrimitive.Root onOpenChange={onClose} open={isOpen}>
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
              {t("session.expired.title")}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="text-loops-orange text-center text-base leading-[22px]">
              {t("session.expired.description_line_1")}
              <br /> {t("session.expired.description_line_2")}&nbsp;
            </DialogPrimitive.Description>
          </div>

          <img
            alt="Crying Loops mascot"
            className="h-[227px] w-[224px] object-contain select-none"
            draggable={false}
            src="/images/crying-loops.png"
          />

          <div className="flex w-full flex-col gap-4 px-5">
            <p className="text-loops-cyan text-center text-2xl leading-[34px] font-semibold">
              {t("session.expired.redirecting_in", { count: countdown })}
            </p>

            <button
              className="bg-loops-cyan inline-flex w-full items-center justify-center rounded-lg px-4 py-2 text-[18px] leading-[30px] font-medium text-[#15153a] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleLoginRedirect}
              type="button"
            >
              {t("session.expired.go_to_login")}
            </button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
