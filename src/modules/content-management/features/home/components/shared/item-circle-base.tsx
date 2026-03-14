import type { ReactNode } from "react"

import { motion } from "framer-motion"

import { cn } from "@/modules/shared/lib/utils"

export type BaseItemCircleProps = {
  children: ReactNode
  colors: CircleColors
  index: number
  isClickable: boolean
  isLoading: boolean
  onClick?: () => void
  progress: number
}

export type CircleColors = {
  inner: string
  outer: string
  progress: string
  text: string
}

export function BaseItemCircle({
  children,
  colors,
  index,
  isClickable,
  isLoading,
  onClick,
  progress,
}: BaseItemCircleProps) {
  return (
    <motion.button
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative flex h-28 w-28 items-center justify-center rounded-full transition-all duration-200",
        colors.outer,
        isClickable && !isLoading && "cursor-pointer hover:scale-105",
        !isClickable && "cursor-not-allowed",
        isLoading && "cursor-wait opacity-50",
      )}
      disabled={isLoading || !isClickable}
      initial={{ opacity: 0, scale: 0.8 }}
      onClick={isClickable ? onClick : undefined}
      transition={{ delay: index * 0.1 }}
    >
      {/* Progress Circle */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
        <circle
          className="text-loops-light/50"
          cx="50"
          cy="50"
          fill="none"
          r="45"
          stroke="currentColor"
          strokeWidth="5"
        />
        {progress > 0 && (
          <circle
            className={colors.progress}
            cx="50"
            cy="50"
            fill="none"
            r="45"
            strokeDasharray={`${progress * 2.83} 283`}
            strokeLinecap="round"
            strokeWidth="3"
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
