import { useTranslation } from "react-i18next"

import { cn } from "@/modules/shared/lib/utils"

type DifficultyTagProps = {
  className?: string
  difficulty: number
}

const difficultyConfig = {
  1: {
    colorClass: "bg-green-500",
    label: "beginner",
  },
  2: {
    colorClass: "bg-yellow-500",
    label: "intermediate",
  },
  3: {
    colorClass: "bg-red-500",
    label: "advanced",
  },
} as const

export function DifficultyTag({ className, difficulty }: DifficultyTagProps) {
  const { t } = useTranslation()
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig]

  return (
    <div className={cn("rounded px-2 py-1", config.colorClass, className)}>
      <span className="font-outfit text-loops-light text-xs font-medium">
        {t(`common.difficulty.${config.label}`)}
      </span>
    </div>
  )
}
