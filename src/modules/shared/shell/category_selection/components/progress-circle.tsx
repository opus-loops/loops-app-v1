import { LockIcon } from "@/modules/shared/components/icons/lock"
import { cn } from "@/modules/shared/lib/utils"
import { ProgressState } from "@/modules/shared/utils/types"

export function ProgressCircle({
  progress,
  progressState,
}: {
  progress: number
  progressState: ProgressState
}) {
  if (progressState === "locked")
    return (
      <div className="bg-loops-light/10 flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm">
        <div className="bg-loops-light/10 flex h-10 w-10 items-center justify-center rounded-full">
          <div className="text-loops-light/50 size-5 shrink-0 grow-0">
            <LockIcon />
          </div>
        </div>
      </div>
    )

  return (
    <div className="relative h-16 w-16">
      <svg className="h-16 w-16 -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          className="text-gray-700"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          strokeWidth="4"
          fill="transparent"
          strokeDasharray={`${2 * Math.PI * 28}`}
          strokeDashoffset={`${
            2 * Math.PI * 28 - (progress / 100) * 2 * Math.PI * 28
          }`}
          className={cn(
            "transition-all duration-300 ease-in-out",
            progressState === "completed"
              ? "text-green-400"
              : "text-loops-cyan",
          )}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-outfit text-loops-light text-sm font-bold">
          {progress}%
        </span>
      </div>
    </div>
  )
}
