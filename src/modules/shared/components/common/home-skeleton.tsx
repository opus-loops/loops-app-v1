import { motion } from "framer-motion"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"

export function HomeSkeleton() {
  return (
    <SpaceBackground>
      <div className="relative z-10 flex size-full flex-col items-center justify-center gap-y-10">
        {/* Skeleton version of Group 1000005011 Design Implementation */}
        <div className="relative">
          {/* Concentric circles background with skeleton styling */}
          <div className="relative aspect-[3/2] h-[600px] max-h-[90vw] w-[600px] max-w-[90vw]">
            {/* Outermost circle - animated skeleton */}
            <motion.div
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1],
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-700/20 to-slate-600/10"
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            {/* Second circle - animated skeleton */}
            <motion.div
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [1, 1.03, 1],
              }}
              className="absolute top-[15%] left-[15%] h-[70%] w-[70%] rounded-full bg-gradient-to-r from-slate-700/25 to-slate-600/15"
              transition={{
                delay: 0.2,
                duration: 2.2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            {/* Third circle - animated skeleton */}
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.04, 1],
              }}
              className="absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full bg-gradient-to-r from-slate-700/30 to-slate-600/20"
              transition={{
                delay: 0.4,
                duration: 2.4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            {/* Inner circle - animated skeleton */}
            <motion.div
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              className="absolute top-[35%] left-[35%] h-[30%] w-[30%] rounded-full bg-gradient-to-r from-slate-700/40 to-slate-600/30"
              transition={{
                delay: 0.6,
                duration: 2.6,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            {/* Animated skeleton dots positioned around the circles */}
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              className="absolute top-[5%] left-[25%] h-4 w-4 rounded-full bg-gradient-to-r from-slate-600/40 to-slate-500/20"
              transition={{
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              animate={{
                opacity: [0.25, 0.65, 0.25],
                scale: [0.8, 1.3, 0.8],
              }}
              className="absolute top-[28%] left-[20%] h-3 w-3 rounded-full bg-gradient-to-r from-slate-600/35 to-slate-500/18"
              transition={{
                delay: 0.3,
                duration: 2.1,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              className="absolute top-[38%] left-[62%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              transition={{
                delay: 0.6,
                duration: 1.9,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              className="absolute top-[52%] left-[14%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              transition={{
                delay: 0.9,
                duration: 2.3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              animate={{
                opacity: [0.35, 0.75, 0.35],
                scale: [0.8, 1.15, 0.8],
              }}
              className="absolute top-[75%] left-[70%] h-7 w-7 rounded-full bg-gradient-to-r from-slate-600/45 to-slate-500/28"
              transition={{
                delay: 1.2,
                duration: 2.0,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              className="absolute top-[50%] left-[2%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              transition={{
                delay: 1.5,
                duration: 1.7,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            {/* Central loading indicator */}
            <motion.div
              animate={{ rotate: 360 }}
              className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-600/30 border-t-slate-400/60"
              transition={{
                duration: 2,
                ease: "linear",
                repeat: Infinity,
              }}
            />
          </div>
        </div>

        {/* Loading content skeleton */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="relative z-20 space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title skeleton */}
          <div className="mx-auto h-8 w-48 rounded-lg bg-gradient-to-r from-slate-700/40 to-slate-600/20">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              className="h-full w-full rounded-lg bg-gradient-to-r from-slate-600/20 to-slate-500/10"
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>

          {/* Subtitle skeleton */}
          <div className="mx-auto h-5 w-32 rounded bg-gradient-to-r from-slate-700/30 to-slate-600/15">
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              className="h-full w-full rounded bg-gradient-to-r from-slate-600/15 to-slate-500/8"
              transition={{
                delay: 0.3,
                duration: 1.8,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </div>
    </SpaceBackground>
  )
}
