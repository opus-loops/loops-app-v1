import { Button } from "@/modules/shared/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/components/ui/dialog"
import { useRouter } from "@tanstack/react-router"
import { AlertTriangle, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

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
            to: "/login",
            search: { redirect: redirectTo },
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

  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogContent className="bg-card border-0 sm:max-w-md">
        <DialogHeader className="flex flex-col items-center space-y-4 pb-4 text-center">
          <div className="from-loops-gradient-danger-start to-loops-gradient-danger-end flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r shadow-lg">
            <AlertTriangle className="text-loops-light h-8 w-8" />
          </div>
          <DialogTitle className="font-outfit text-loops-text text-2xl font-semibold">
            {t("session.expired.title")}
          </DialogTitle>
          <DialogDescription className="font-outfit text-muted-foreground text-base leading-relaxed">
            {t("session.expired.description_line_1")}
            <br />
            {t("session.expired.description_line_2")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-0">
          <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
            <div className="text-loops-text flex items-center justify-center gap-2">
              <Clock className="text-loops-orange h-5 w-5 animate-pulse" />
              <span className="font-outfit text-lg font-semibold">
                {t("session.expired.redirecting_in", { count: countdown })}
              </span>
            </div>

            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                className="from-loops-gradient-danger-start to-loops-gradient-danger-end h-full bg-gradient-to-r transition-all duration-1000 ease-linear"
                style={{
                  width: `${((3 - countdown) / 3) * 100}%`,
                }}
              />
            </div>
          </div>

          <Button
            onClick={() => {
              onClose()
              const redirectTo = `${window.location.pathname}${window.location.search}${window.location.hash}`
              router.navigate({
                to: "/login",
                search: { redirect: redirectTo },
              })
            }}
            className="font-outfit from-loops-purple to-loops-blue hover:from-loops-purple/90 hover:to-loops-blue/90 text-loops-light w-full bg-gradient-to-r font-medium"
            size="lg"
          >
            {t("session.expired.go_to_login")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
