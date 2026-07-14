import { Link, useRouter } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"
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

  const handleReset = () => {
    reset()
    router.invalidate()
  }

  return (
    <SpaceBackground>
      <div className="font-outfit flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="bg-loops-cyan/15 absolute size-48 rounded-full blur-3xl"
            />
            <img
              alt=""
              className="relative h-36 w-36 object-contain select-none"
              draggable={false}
              src="/images/crying-loops.png"
            />
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-loops-cyan text-2xl leading-tight font-bold">
              {t("common.unexpected_error")}
            </h1>
            <p className="text-loops-gray max-w-xs text-base leading-relaxed">
              {t("common.error_description")}
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error.message ? (
            <details className="border-loops-gray/20 bg-loops-auth-card/40 w-full rounded-xl border px-4 py-3 text-start">
              <summary className="text-loops-gray cursor-pointer text-sm font-medium">
                {t("common.error_details")}
              </summary>
              <p className="text-loops-light/80 mt-2 font-mono text-xs leading-relaxed break-words">
                {error.message}
              </p>
            </details>
          ) : null}

          <div className="flex w-full flex-col gap-3">
            <Button
              className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-6 text-lg leading-5 font-semibold shadow-none"
              onClick={handleReset}
              type="button"
            >
              {t("common.try_again")}
            </Button>
            <Link
              className={cn(
                buttonVariants({ variant: "outline" }),
                "font-outfit border-loops-gray/30 text-loops-light hover:bg-loops-light/5 hover:text-loops-light w-full rounded-xl border bg-transparent py-6 text-lg font-semibold shadow-none",
              )}
              to="/"
            >
              {t("common.home")}
            </Link>
          </div>
        </div>
      </div>
    </SpaceBackground>
  )
}
