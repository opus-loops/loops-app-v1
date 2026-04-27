import { Link } from "@tanstack/react-router"
import { motion, useReducedMotion } from "framer-motion"
import { useTranslation } from "react-i18next"

import { buildAuthSearch } from "@/modules/authentication/lib/auth-search"
import { Button } from "@/modules/shared/components/ui/button"

type SelectorScreenProps = {
  redirect?: string | undefined
}

export function SelectorScreen({ redirect }: SelectorScreenProps) {
  const { t } = useTranslation()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="bg-loops-background relative min-h-screen w-full overflow-hidden">
      <img
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 size-full object-cover object-top opacity-70"
        src="/svg/doodle.svg"
      />

      <div className="from-loops-background via-loops-background/80 pointer-events-none absolute inset-0 bg-gradient-to-b to-transparent" />

      <div className="relative z-10 flex min-h-screen w-full flex-col justify-end pt-8">
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-end">
          <motion.img
            alt="Logo Loops"
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 h-auto w-40 max-w-full px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            src="/svg/loops-orange.svg"
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <motion.img
            alt="Mascotte Loops prête à commencer l’aventure"
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 -mb-4 h-auto w-full max-w-96 px-4"
            initial={{ opacity: 0, y: 20 }}
            src="/images/loops-swim.png"
            transition={{ delay: 0.4, duration: 0.6 }}
          />
        </div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="bg-loops-auth-card relative z-20 w-full rounded-t-4xl px-6 pt-8 pb-10 shadow-2xl sm:mx-auto sm:rounded-t-4xl"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 40 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  damping: 26,
                  duration: 0.6,
                  stiffness: 220,
                  type: "spring",
                }
          }
        >
          <div className="mx-auto flex w-full max-w-sm flex-col items-center text-center">
            <h1 className="font-outfit text-loops-orange text-[2rem] leading-tight font-bold">
              {t("auth.selector.adventure_starts")}
            </h1>

            <p className="font-outfit text-loops-light/90 mt-4 text-base leading-7 font-medium tracking-tight whitespace-pre-line">
              {t("auth.selector.adventure_description")}
            </p>

            <Button
              asChild
              className="font-outfit text-loops-light bg-loops-cyan hover:bg-loops-cyan/90 mt-8 min-h-14 w-full rounded-xl px-6 py-4 text-lg leading-5 font-semibold shadow-none"
            >
              <Link search={buildAuthSearch("register", redirect)} to="/auth">
                {t("auth.register.submit")}
              </Link>
            </Button>

            <Link
              className="text-loops-cyan font-outfit mt-5 inline-flex min-h-11 items-center justify-center text-base leading-6 font-semibold tracking-tight"
              search={buildAuthSearch("login", redirect)}
              to="/auth"
            >
              {t("auth.register.have_account")}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
