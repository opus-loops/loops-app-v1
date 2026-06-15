import { motion } from "framer-motion"
import { Sparkles, Trophy } from "lucide-react"
import { Trans, useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card"

interface CertificateCardProps {
  categoryName: string
  certificate: {
    pdfURL: string
  }
}

export function CertificateCard({
  categoryName,
  certificate,
}: CertificateCardProps) {
  const { t } = useTranslation()

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="mx-auto w-full max-w-sm pb-32"
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{
        damping: 20,
        delay: 0.2,
        stiffness: 260,
        type: "spring",
      }}
    >
      <div className="relative">
        {/* Decorative background glow */}
        <div className="bg-loops-cyan/20 absolute -inset-1 rounded-2xl blur-xl" />
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-yellow-500/20 blur-2xl" />
        <div className="bg-loops-cyan/20 absolute -bottom-10 -left-10 h-32 w-32 rounded-full blur-2xl" />

        <Card className="bg-loops-background/80 relative overflow-hidden border-2 border-[#FFCE51]/30 shadow-2xl backdrop-blur-xl">
          {/* Shimmer effect overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/5 via-white/0 to-transparent opacity-50" />

          <CardHeader className="relative items-center pb-2 text-center">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              className="mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-[#FFCE51] to-[#F59E0B] shadow-lg shadow-orange-500/20"
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Trophy className="text-loops-dark size-8" />
            </motion.div>

            <div className="mb-2 flex items-center gap-2 rounded-full border border-[#FFCE51]/30 bg-[#FFCE51]/10 px-4 py-1.5 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-[#FFCE51]" />
              <span className="font-outfit text-xs font-bold tracking-wide text-[#FFCE51] uppercase">
                {t("home.certificate.unlocked")}
              </span>
              <Sparkles className="size-3.5 text-[#FFCE51]" />
            </div>

            <CardTitle className="font-outfit text-loops-light mt-2 text-2xl font-bold">
              {t("home.certificate.title")}
            </CardTitle>
            <CardDescription className="font-outfit text-slate-300">
              <Trans
                components={{
                  strong: <span className="font-bold text-[#FFCE51]" />,
                }}
                i18nKey="home.certificate.description"
                values={{ categoryName }}
              />
            </CardDescription>
          </CardHeader>

          <CardContent className="relative px-6 py-2">
            <div className="group relative overflow-hidden rounded-xl border-2 border-white/10 bg-black/40 p-1 shadow-inner transition-all hover:border-[#FFCE51]/30">
              <a
                aria-label={t("home.certificate.preview_aria_label")}
                className="relative flex aspect-[1.414/1] w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 text-center transition-transform hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-[#FFCE51] focus-visible:outline-none"
                href={certificate.pdfURL}
                rel="noreferrer noopener"
                target="_blank"
              >
                <div className="absolute inset-4 rounded-lg border-2 border-[#FFCE51]/50" />
                <div className="absolute top-5 right-5 left-5 h-2 rounded-full bg-slate-200" />
                <div className="absolute top-11 right-10 left-10 h-1.5 rounded-full bg-slate-200" />
                <div className="absolute right-8 bottom-8 left-8 h-16 rounded-lg bg-slate-200/70" />
                <div className="relative flex flex-col items-center justify-center gap-2 p-4">
                  <Trophy className="size-12 text-[#F59E0B]" />
                  <p className="text-sm font-medium text-slate-600">
                    {t("home.certificate.preview_title")}
                  </p>
                </div>

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10" />
              </a>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-4 pb-8">
            <p className="font-outfit mt-2 flex items-center gap-2 text-xs font-medium text-slate-400">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              {t("home.certificate.keep_going")}
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ delay: 1, duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  )
}
