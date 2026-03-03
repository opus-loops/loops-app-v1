import { cn } from "@/modules/shared/lib/utils"

type DifficultyTagProps = {
  className?: string
  difficulty: number
}

const difficultyConfig = {
  1: {
    colorClass: "bg-green-500",
    label: "Beginner",
  },
  2: {
    colorClass: "bg-yellow-500",
    label: "Intermediate",
  },
  3: {
    colorClass: "bg-red-500",
    label: "Advanced",
  },
} as const

export function DifficultyTag({ className, difficulty }: DifficultyTagProps) {
  const config = difficultyConfig[difficulty as keyof typeof difficultyConfig]

  return (
    <div className={cn("rounded px-2 py-1", config.colorClass, className)}>
      <span className="font-outfit text-loops-light text-xs font-medium">
        {config.label}
      </span>
    </div>
  )
}
