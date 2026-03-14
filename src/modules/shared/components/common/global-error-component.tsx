import { captureException } from "@sentry/tanstackstart-react"
import { Link, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"

import { Button, buttonVariants } from "@/modules/shared/components/ui/button"
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

  return (
    <div className="bg-loops-background fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex w-full max-w-md flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-loops-orange text-3xl leading-[34px] font-semibold">
            {t("common.unexpected_error")}
          </h1>
          <p className="text-loops-orange text-lg leading-[22px]">
            {t("common.error")}
          </p>
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
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full text-lg font-medium",
            )}
            to="/"
          >
            {t("common.home")}
          </Link>
        </div>
      </div>
    </div>
  )
}
