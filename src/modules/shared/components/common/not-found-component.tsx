import { Link, useRouter } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { Button, buttonVariants } from "@/modules/shared/components/ui/button"
import { cn } from "@/modules/shared/lib/utils"

export function NotFoundComponent() {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <SpaceBackground>
      <div className="font-outfit flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="flex w-full max-w-sm flex-col items-center gap-8">
          <div className="relative flex items-center justify-center">
            <div
              aria-hidden
              className="bg-loops-purple/15 absolute size-48 rounded-full blur-3xl"
            />
            <img
              alt=""
              className="relative h-36 w-36 object-contain select-none"
              draggable={false}
              src="/images/flying-loops.png"
            />
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-loops-purple text-sm font-semibold tracking-widest uppercase">
              404
            </span>
            <h1 className="text-loops-cyan text-2xl leading-tight font-bold">
              {t("common.page_not_found")}
            </h1>
            <p className="text-loops-gray max-w-xs text-base leading-relaxed">
              {t("common.page_not_found_description")}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3">
            <Link
              className={cn(
                buttonVariants({ variant: "default" }),
                "font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-6 text-lg leading-5 font-semibold shadow-none",
              )}
              to="/"
            >
              {t("common.home")}
            </Link>
            <Button
              className="font-outfit border-loops-gray/30 text-loops-light hover:bg-loops-light/5 hover:text-loops-light w-full rounded-xl border bg-transparent py-6 text-lg font-semibold shadow-none"
              onClick={() => router.history.back()}
              type="button"
              variant="outline"
            >
              {t("common.back")}
            </Button>
          </div>
        </div>
      </div>
    </SpaceBackground>
  )
}
