import { motion } from "framer-motion"
import { Download, Eye, Sparkles, Trophy } from "lucide-react"
import { Trans, useTranslation } from "react-i18next"

import { buttonVariants } from "@/modules/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card"
import { cn } from "@/modules/shared/lib/utils"
import { Link } from "@tanstack/react-router"

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
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.2,
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
              <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-lg bg-white">
                <object
                  aria-label={t("home.certificate.preview_aria_label")}
                  className="h-full w-full"
                  data={`${certificate.pdfURL}#view=Fit&toolbar=0&navpanes=0&scrollbar=0`}
                  type="application/pdf"
                >
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-slate-100 p-4 text-center">
                    <Trophy className="size-12 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                      {t("home.certificate.preview_title")}
                    </p>
                  </div>
                </object>

                {/* Overlay on hover/interaction hint */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10" />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-6 pb-8">
            <div className="grid w-full grid-cols-2 gap-3">
              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "bg-loops-background-secondary text-loops-light hover:bg-loops-background-secondary/80 h-12 border-none font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]",
                )}
                to={certificate.pdfURL}
                rel="noreferrer noopener"
                target="_blank"
              >
                <Eye className="mr-2 size-4" />
                {t("home.certificate.view_pdf")}
              </Link>

              <Link
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "bg-loops-background-secondary text-loops-light hover:bg-loops-background-secondary/80 h-12 border-none font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]",
                )}
                download
                to={certificate.pdfURL}
              >
                <Download className="mr-2 size-4" />
                {t("home.certificate.download_pdf")}
              </Link>
            </div>

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
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
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
