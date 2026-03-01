import { cn } from "@/modules/shared/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"

export type CircleColors = {
  outer: string
  inner: string
  progress: string
  text: string
}

export type BaseItemCircleProps = {
  children: ReactNode
  colors: CircleColors
  progress: number
  isClickable: boolean
  isLoading: boolean
  index: number
  onClick?: () => void
}

export function BaseItemCircle({
  children,
  colors,
  progress,
  isClickable,
  isLoading,
  index,
  onClick,
}: BaseItemCircleProps) {
  return (
    <motion.button
      onClick={isClickable ? onClick : undefined}
      disabled={isLoading || !isClickable}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-200",
        colors.outer,
        isClickable && !isLoading && "cursor-pointer hover:scale-105",
        !isClickable && "cursor-not-allowed",
        isLoading && "cursor-wait opacity-50",
      )}
    >
      {/* Progress Circle */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          className="text-loops-light/50"
        />
        {progress > 0 && (
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress * 2.83} 283`}
            className={colors.progress}
          />
        )}
      </svg>

      {/* Inner Circle */}
      <div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full",
          colors.inner,
        )}
      >
        {children}
      </div>
    </motion.button>
  )
}
