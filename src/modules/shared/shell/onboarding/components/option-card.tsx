import { cn } from "@/modules/shared/lib/utils"
import type { ReactNode } from "react"

type OptionCardProps = {
  className?: string
  icon: ReactNode
  isSelected?: boolean
  onClick?: () => void
  subtitle?: string
  title: string
  variant?:
    | "average"
    | "beginner"
    | "casual"
    | "developer"
    | "expert"
    | "hard"
    | "medium"
    | "passionate"
    | "professional"
    | "serious"
    | "skilled"
    | "student"
}

const variantStyles = {
  average: "bg-gradient-to-r from-purple-600 to-purple-500",
  beginner: "bg-gradient-to-r from-orange-600 to-orange-500",
  casual: "bg-gradient-to-r from-pink-600 to-pink-500",
  developer: "bg-gradient-to-r from-blue-700 to-blue-600",
  expert: "bg-gradient-to-r from-pink-600 to-pink-500",
  hard: "bg-gradient-to-r from-purple-600 to-purple-500",
  medium: "bg-gradient-to-r from-blue-700 to-blue-600",
  passionate: "bg-gradient-to-r from-pink-600 to-pink-500",
  professional: "bg-gradient-to-r from-purple-600 to-purple-500",
  serious: "bg-gradient-to-r from-orange-600 to-orange-500",
  skilled: "bg-gradient-to-r from-blue-700 to-blue-600",
  student: "bg-gradient-to-r from-orange-600 to-orange-500",
}

export function OptionCard({
  className,
  icon,
  isSelected = false,
  onClick,
  subtitle,
  title,
  variant = "beginner",
}: OptionCardProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between rounded-xl p-6 text-left transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
        variantStyles[variant],
        isSelected && "ring-opacity-50 ring-2 ring-white",
        className,
      )}
      onClick={onClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-loops-light flex h-9 w-9 items-center justify-center">
            {icon}
          </div>
          <span className="font-outfit text-loops-light text-xl font-medium">
            {title}
          </span>
        </div>

        {subtitle && (
          <span className="font-outfit text-xs text-gray-200">{subtitle}</span>
        )}
      </div>
    </button>
  )
}
