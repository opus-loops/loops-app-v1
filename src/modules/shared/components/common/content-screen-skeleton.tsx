import { motion } from "framer-motion"

export function ContentScreenSkeleton() {
  return (
    <div className="bg-loops-background flex h-full flex-col">
      {/* Header Skeleton */}
      <div className="relative flex items-center justify-center px-4 py-6">
        {/* Back button skeleton */}
        <div className="bg-loops-light/10 absolute left-4 h-8 w-8 animate-pulse rounded-full" />

        {/* Title skeleton */}
        <div className="bg-loops-light/20 h-6 w-32 animate-pulse rounded" />
      </div>

      {/* Content Area Skeleton */}
      <div className="flex-1 px-4 pb-20">
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-sm space-y-6">
            {/* Main content box skeleton */}
            <motion.div
              className="bg-loops-light/10 rounded-3xl p-8"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Glow effect skeleton */}
              <div className="bg-loops-light/20 mx-auto mb-6 h-26 w-26 animate-pulse rounded-full"></div>

              {/* Title skeleton */}
              <div className="bg-loops-light/30 mx-auto mb-4 h-8 w-40 animate-pulse rounded"></div>

              {/* Stats skeleton */}
              <div className="mb-6 flex items-end justify-center gap-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center space-y-3">
                    <div className="bg-loops-light/30 h-6 w-6 animate-pulse rounded"></div>
                    <div className="space-y-2 text-center">
                      <div className="bg-loops-light/30 h-6 w-8 animate-pulse rounded"></div>
                      <div className="bg-loops-light/20 h-4 w-12 animate-pulse rounded"></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Button skeleton */}
              <div className="bg-loops-light/30 h-14 w-full animate-pulse rounded-xl"></div>
            </motion.div>

            {/* Placeholder text skeleton */}
            <div className="space-y-2 text-center">
              <div className="bg-loops-light/10 mx-auto h-3 w-48 animate-pulse rounded"></div>
              <div className="bg-loops-light/5 mx-auto h-3 w-56 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tab Navigation Skeleton */}
      <div className="bg-loops-background/95 fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2 backdrop-blur-sm">
        <div className="flex items-center justify-around px-4 py-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-1">
              <div className="bg-loops-light/20 h-6 w-6 animate-pulse rounded"></div>
              <div className="bg-loops-light/10 h-3 w-8 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
