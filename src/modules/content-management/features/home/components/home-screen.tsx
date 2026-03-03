import { Link } from "@tanstack/react-router"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { AwardIcon } from "@/modules/shared/components/icons/award"
import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { OpenCategoriesButton } from "@/modules/shared/components/navigation/open-categories-button"
import { Button } from "@/modules/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/modules/shared/components/ui/card"
import { useExploreCategory } from "../../content-detail/services/use-explore-category"
import { useCategoryContent } from "../../content-list/services/use-category-content"
import { CategoryMapping } from "./category-mapping"

type HomeScreenProps = { categoryId: string }
export function HomeScreen({ categoryId }: HomeScreenProps) {
  const { categoryItems } = useCategoryContent({ categoryId })
  const { category, certificate } = useExploreCategory({ categoryId })

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    offset: ["start end", "end start"],
    target: containerRef,
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <SpaceBackground>
      <div
        className="relative z-10 flex size-full flex-col items-center justify-start gap-y-10"
        ref={containerRef}
      >
        <div className="fixed top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative aspect-[3/2] h-[600px] max-h-[90vw] w-[600px] max-w-[90vw]"
            style={{ rotate }}
          >
            <div className="bg-loops-cyan absolute inset-0 rounded-full opacity-10" />
            <div className="bg-loops-cyan absolute top-[15%] left-[15%] h-[70%] w-[70%] rounded-full opacity-10" />
            <div className="bg-loops-cyan absolute top-[30%] left-[30%] h-[40%] w-[40%] rounded-full opacity-10" />
            <div className="bg-loops-cyan absolute top-[35%] left-[35%] h-[30%] w-[30%] rounded-full opacity-20" />
            <div className="absolute top-[5%] left-[25%] h-4 w-4 rounded-full bg-purple-500" />
            <div className="absolute top-[28%] left-[20%] h-3 w-3 rounded-full bg-orange-500" />
            <div className="absolute top-[38%] left-[62%] h-3.5 w-3.5 rounded-full bg-blue-600" />
            <div className="absolute top-[52%] left-[14%] h-3.5 w-3.5 rounded-full bg-pink-500" />
            <div className="absolute top-[75%] left-[70%] h-7 w-7 rounded-full bg-pink-600" />
            <div className="bg-loops-cyan absolute top-[50%] left-[2%] h-3.5 w-3.5 rounded-full" />
          </motion.div>
        </div>

        <div className="z-10 flex w-full max-w-sm items-center justify-between">
          {/* Left Button - Navigate to all categories */}
          <OpenCategoriesButton search={{ category: "all" }} to="/" />

          <div className="shrink-0 grow-1 text-center">
            <Link
              className="font-outfit text-loops-light text-center text-sm font-medium text-wrap"
              search={{ category: category.categoryId, type: "details" }}
              to="/"
            >
              category: {category.name[0].content}
            </Link>
          </div>

          {category.startedCategory && (
            <div className="bg-loops-background-secondary/50 flex h-10 min-w-[60px] items-center justify-center rounded-lg px-2">
              <span className="font-outfit text-loops-light text-sm font-bold">
                {category.startedCategory.score || 0}XP
              </span>
              <div className="size-8 shrink-0 grow-0 text-[#FFCE51]">
                <HalfStarIcon />
              </div>
            </div>
          )}
        </div>

        <div className="relative z-20 space-y-6 text-center">
          <CategoryMapping
            categoryId={categoryId}
            categoryItems={categoryItems}
          />

          {category.startedCategory &&
            category.startedCategory.status !== "completed" &&
            certificate && (
              <motion.div
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mx-auto w-full max-w-sm"
                initial={{ opacity: 0, scale: 0.98, y: 16 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <Card className="relative overflow-hidden border-white/10 bg-white/5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.65)] backdrop-blur-md">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="bg-loops-cyan/25 absolute -top-24 -left-24 h-56 w-56 rounded-full blur-3xl" />
                    <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-purple-500/25 blur-3xl" />
                    <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
                  </div>

                  <CardHeader className="relative">
                    <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1">
                      <span className="text-[#FFCE51]">
                        <span className="block size-4">
                          <AwardIcon />
                        </span>
                      </span>
                      <span className="font-outfit text-loops-light text-xs font-semibold tracking-wide">
                        Certificate Unlocked
                      </span>
                    </div>

                    <CardTitle className="font-outfit text-loops-light mt-3 text-lg">
                      Congratulations, you did it!
                    </CardTitle>
                    <CardDescription className="font-outfit text-loops-light/70">
                      Your certificate for{" "}
                      <span className="text-loops-light font-semibold">
                        {category.name[0]?.content}
                      </span>{" "}
                      is ready.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
                      <div className="relative w-full overflow-hidden rounded-xl bg-[#0b0b2d]/60 ring-1 ring-white/10">
                        <div className="pointer-events-none absolute inset-0">
                          <div className="absolute -top-10 left-8 h-24 w-24 rounded-full bg-[#31bce6]/20 blur-2xl" />
                          <div className="absolute right-8 -bottom-10 h-24 w-24 rounded-full bg-purple-500/20 blur-2xl" />
                          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />
                        </div>

                        <div className="absolute top-3 left-3 z-10 rounded-full border border-white/10 bg-black/30 px-2 py-1">
                          <span className="font-outfit text-loops-light/80 text-[10px] font-semibold tracking-wide">
                            PDF
                          </span>
                        </div>

                        <div className="relative aspect-[297/210] w-full overflow-hidden rounded-xl">
                          <object
                            aria-label="Certificate PDF preview"
                            className="h-full w-full"
                            data={`${certificate.pdfURL}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                            type="application/pdf"
                          >
                            <iframe
                              className="h-full w-full"
                              loading="lazy"
                              scrolling="no"
                              src={`${certificate.pdfURL}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                              title="Certificate PDF preview"
                            />
                            <div className="flex h-full w-full items-center justify-center p-4">
                              <a
                                className="text-loops-cyan underline"
                                href={certificate.pdfURL}
                                rel="noreferrer noopener"
                                target="_blank"
                              >
                                Open the certificate PDF
                              </a>
                            </div>
                          </object>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="relative flex flex-col gap-3">
                    <div className="grid w-full grid-cols-2 gap-2">
                      <Button asChild className="w-full" variant="secondary">
                        <a
                          href={certificate.pdfURL}
                          rel="noreferrer noopener"
                          target="_blank"
                        >
                          View PDF
                        </a>
                      </Button>

                      <Button asChild className="w-full" variant="outline">
                        <a download href={certificate.pdfURL}>
                          Download PDF
                        </a>
                      </Button>
                    </div>

                    <div className="font-outfit text-loops-light/60 text-xs">
                      Keep going — more wins are waiting.
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
        </div>
      </div>
    </SpaceBackground>
  )
}
