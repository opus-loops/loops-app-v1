import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import type { ReactNode } from "react"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"

export function ComingSoonScreen({ children }: { children?: ReactNode }) {
  const { t } = useTranslation()

  return (
    <SpaceBackground>
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-6 pb-24">
        {/* Floating Mascot */}
        <motion.div
          animate={{
            rotate: [0, 5, -5, 0],
            y: [0, -20, 0],
          }}
          className="relative mb-8 h-64 w-64 md:h-80 md:w-80"
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <img
            alt={t("common.coming_soon")}
            className="h-full w-full object-contain drop-shadow-2xl filter"
            src="/images/flying-loops.png"
          />

          {/* Decorative elements */}
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.2, 1] }}
            className="absolute top-10 -right-4 h-6 w-6 rounded-full bg-yellow-400 blur-sm"
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.5, 1] }}
            className="bg-loops-cyan absolute bottom-20 -left-8 h-4 w-4 rounded-full blur-sm"
            transition={{ delay: 1, duration: 3, repeat: Infinity }}
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-outfit text-loops-light text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl">
              {t("common.coming_soon")}
            </h1>
            <motion.div
              animate={{ width: "100%" }}
              className="from-loops-cyan to-loops-pink mt-2 h-1.5 w-full rounded-full bg-gradient-to-r"
              initial={{ width: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="font-outfit text-loops-light/80 max-w-md text-lg font-medium md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.4 }}
          >
            {t("first_install.welcome.slides.2.description")}
          </motion.p>
        </div>
      </div>
      {children}
    </SpaceBackground>
  )
}
