import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { motion } from "framer-motion"

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
              className="absolute inset-0 rounded-full bg-gradient-to-r from-slate-700/20 to-slate-600/10"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Second circle - animated skeleton */}
            <motion.div
              className="absolute top-[15%] left-[15%] h-[70%] w-[70%] rounded-full bg-gradient-to-r from-slate-700/25 to-slate-600/15"
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />

            {/* Third circle - animated skeleton */}
            <motion.div
              className="absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full bg-gradient-to-r from-slate-700/30 to-slate-600/20"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />

            {/* Inner circle - animated skeleton */}
            <motion.div
              className="absolute top-[35%] left-[35%] h-[30%] w-[30%] rounded-full bg-gradient-to-r from-slate-700/40 to-slate-600/30"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />

            {/* Animated skeleton dots positioned around the circles */}
            <motion.div
              className="absolute top-[5%] left-[25%] h-4 w-4 rounded-full bg-gradient-to-r from-slate-600/40 to-slate-500/20"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute top-[28%] left-[20%] h-3 w-3 rounded-full bg-gradient-to-r from-slate-600/35 to-slate-500/18"
              animate={{
                opacity: [0.25, 0.65, 0.25],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: 2.1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />

            <motion.div
              className="absolute top-[38%] left-[62%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              transition={{
                duration: 1.9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
            />

            <motion.div
              className="absolute top-[52%] left-[14%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              transition={{
                duration: 2.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.9,
              }}
            />

            <motion.div
              className="absolute top-[75%] left-[70%] h-7 w-7 rounded-full bg-gradient-to-r from-slate-600/45 to-slate-500/28"
              animate={{
                opacity: [0.35, 0.75, 0.35],
                scale: [0.8, 1.15, 0.8],
              }}
              transition={{
                duration: 2.0,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
            />

            <motion.div
              className="absolute top-[50%] left-[2%] h-3.5 w-3.5 rounded-full bg-gradient-to-r from-slate-600/38 to-slate-500/22"
              animate={{
                opacity: [0.28, 0.68, 0.28],
                scale: [0.8, 1.25, 0.8],
              }}
              transition={{
                duration: 1.7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />

            {/* Central loading indicator */}
            <motion.div
              className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-slate-600/30 border-t-slate-400/60"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </div>

        {/* Loading content skeleton */}
        <motion.div
          className="relative z-20 space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Title skeleton */}
          <div className="mx-auto h-8 w-48 rounded-lg bg-gradient-to-r from-slate-700/40 to-slate-600/20">
            <motion.div
              className="h-full w-full rounded-lg bg-gradient-to-r from-slate-600/20 to-slate-500/10"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Subtitle skeleton */}
          <div className="mx-auto h-5 w-32 rounded bg-gradient-to-r from-slate-700/30 to-slate-600/15">
            <motion.div
              className="h-full w-full rounded bg-gradient-to-r from-slate-600/15 to-slate-500/8"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </div>
        </motion.div>
      </div>
    </SpaceBackground>
  )
}
