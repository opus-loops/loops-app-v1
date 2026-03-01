import { cn } from "@/modules/shared/lib/utils"

type DifficultyTagProps = {
  difficulty: number
  className?: string
}

const difficultyConfig = {
  1: {
    label: "Beginner",
    colorClass: "bg-green-500",
  },
  2: {
    label: "Intermediate",
    colorClass: "bg-yellow-500",
  },
  3: {
    label: "Advanced",
    colorClass: "bg-red-500",
  },
} as const

export function DifficultyTag({ difficulty, className }: DifficultyTagProps) {
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig]

  return (
    <div className={cn("rounded px-2 py-1", config.colorClass, className)}>
      <span className="font-outfit text-loops-light text-xs font-medium">
        {config.label}
      </span>
    </div>
  )
}
