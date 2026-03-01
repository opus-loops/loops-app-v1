import { motion } from "framer-motion"

export function CategoryContentSkeleton() {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 py-6">
        {/* Back button skeleton */}
        <div className="absolute left-4 h-8 w-8 rounded-full bg-gradient-to-r from-slate-700/40 to-slate-600/30">
          <div className="h-full w-full animate-pulse rounded-full bg-gradient-to-r from-slate-600/20 to-slate-500/10" />
        </div>

        <h1 className="font-outfit text-loops-light text-xl font-bold tracking-tight">
          Category content
        </h1>
      </div>

      {/* Content Items */}
      <div className="flex-1 overflow-y-auto px-4 pb-6">
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
    </div>
  )
}
