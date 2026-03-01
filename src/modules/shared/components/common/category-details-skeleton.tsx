import { motion } from "framer-motion"

export function CategoryDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-6">
        {/* Back button skeleton */}
        <div className="absolute left-4 h-8 w-8 rounded-full bg-gradient-to-r from-slate-700/40 to-slate-600/30">
          <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
        </div>

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          Category details
        </h1>
      </div>

      <div className="flex-1 overflow-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Category Cover Image Skeleton */}
          <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/30 to-slate-800/20">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-slate-600/10 to-transparent" />
          </div>

          {/* Category Info Skeleton */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-slate-700/40 to-slate-600/20">
              <div className="h-8 w-8 animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
            </div>
            <div className="flex-1">
              <div className="mb-1 h-6 w-32 rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20">
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
            </div>
          </div>

          {/* Tags Skeleton */}
          <div className="flex flex-wrap items-center gap-2">
            {[16, 20, 14, 12].map((width, index) => (
              <div
                key={index}
                className={`h-6 w-${width} rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20`}
              >
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
            ))}
          </div>

          {/* Description Skeleton */}
          <div className="space-y-2">
            {["w-full", "w-3/4", "w-1/2"].map((width, index) => (
              <div
                key={index}
                className={`h-4 ${width} rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20`}
              >
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
            ))}
          </div>

          {/* Content Section Skeleton */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20">
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
              <div className="h-6 w-16 flex-1 rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20">
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
              <div className="h-4 w-16 rounded bg-gradient-to-r from-slate-700/40 to-slate-600/20">
                <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
              </div>
            </div>

            {/* Content Items Skeleton */}
            <div className="space-y-3">
              {[...Array(3)].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.15,
                    duration: 0.5,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  className="bg-loops-light/20 rounded-xl border border-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Icon skeleton */}
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-600/30 shadow-inner">
                        <div className="h-full w-full animate-pulse rounded-lg bg-gradient-to-br from-slate-600/30 to-slate-500/15" />
                      </div>
                      <div className="space-y-2">
                        {/* Title skeleton */}
                        <div className="h-4 w-24 rounded bg-gradient-to-r from-slate-700/50 to-slate-600/30">
                          <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/30 to-slate-500/15" />
                        </div>
                        {/* Subtitle skeleton */}
                        <div className="h-3 w-16 rounded bg-gradient-to-r from-slate-700/40 to-slate-600/25">
                          <div className="h-full w-full animate-pulse rounded bg-gradient-to-r from-slate-600/25 to-slate-500/12" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Progress badge skeleton */}
                      <div className="h-6 w-12 rounded-full bg-gradient-to-r from-slate-700/50 to-slate-600/30">
                        <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-slate-600/30 to-slate-500/15" />
                      </div>
                      {/* Action button skeleton */}
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-slate-700/50 to-slate-600/30 shadow-inner">
                        <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-br from-slate-600/30 to-slate-500/15" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Continue Learning Button Skeleton */}
          <div className="pb-8">
            <div className="h-14 w-full rounded-xl bg-gradient-to-r from-slate-700/40 to-slate-600/20">
              <div className="h-full w-full animate-pulse rounded-xl bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
