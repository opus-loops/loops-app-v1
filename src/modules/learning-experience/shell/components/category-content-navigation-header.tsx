import { ChevronLeft, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/modules/shared/components/ui/button"

type CategoryContentNavigationHeaderProps = {
  canNavigateNext: boolean
  canNavigatePrevious: boolean
  contentType: "quizzes" | "skills"
  onNext: () => void
  onPrevious: () => void
  title: string
}

export function CategoryContentNavigationHeader({
  canNavigateNext,
  canNavigatePrevious,
  contentType,
  onNext,
  onPrevious,
  title,
}: CategoryContentNavigationHeaderProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3">
      {canNavigatePrevious ? (
        <Button
          aria-label={t("common.back")}
          className="border-loops-info/35 bg-loops-info/15 text-loops-info hover:bg-loops-info/25 h-11 w-11 rounded-xl border p-0 shadow-lg backdrop-blur-sm"
          onClick={onPrevious}
          type="button"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      ) : (
        <div aria-hidden className="h-11 w-11" />
      )}

      <div className="flex min-w-0 justify-center">
        <div
          className="border-loops-orange/35 bg-loops-orange/15 text-loops-orange inline-flex min-h-11 max-w-full items-center justify-center rounded-xl border px-4 py-2 text-center text-sm font-semibold shadow-lg backdrop-blur-sm"
          data-testid="category-content-current-badge"
        >
          <span className="block truncate">
            {contentType === "skills"
              ? t("quiz.skill_prefix")
              : t("quiz.header_prefix")}{" "}
            {title}
          </span>
        </div>
      </div>

      {canNavigateNext ? (
        <Button
          aria-label={t("common.next")}
          className="border-loops-info/35 bg-loops-info/15 text-loops-info hover:bg-loops-info/25 h-11 w-11 rounded-xl border p-0 shadow-lg backdrop-blur-sm"
          onClick={onNext}
          type="button"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      ) : (
        <div aria-hidden className="h-11 w-11" />
      )}
    </div>
  )
}
