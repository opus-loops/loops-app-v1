import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { ReactNode } from "react"

export function ComingSoonScreen({ children }: { children?: ReactNode }) {
  const { t } = useTranslation()

  return (
    <SpaceBackground>
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-6 pb-24">
        {/* Floating Mascot */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mb-8 h-64 w-64 md:h-80 md:w-80"
        >
          <img
            src="/assets/images/flying-loops.png"
            alt={t("common.coming_soon")}
            className="h-full w-full object-contain drop-shadow-2xl filter"
          />
          
          {/* Decorative elements */}
           <motion.div 
            className="absolute -right-4 top-10 h-6 w-6 rounded-full bg-yellow-400 blur-sm"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="bg-loops-cyan absolute -left-8 bottom-20 h-4 w-4 rounded-full blur-sm"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
        </motion.div>

        {/* Text Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <h1 className="font-outfit text-loops-light text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl">
              {t("common.coming_soon")}
            </h1>
            <motion.div 
              className="mt-2 h-1.5 w-full rounded-full bg-gradient-to-r from-loops-cyan to-loops-pink"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-outfit text-loops-light/80 max-w-md text-lg font-medium md:text-xl"
          >
             {t("first_install.welcome.slides.2.description")}
          </motion.p>
        </div>
      </div>
      {children}
    </SpaceBackground>
  )
}
