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
import { Link } from "@tanstack/react-router"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useExploreCategory } from "../../content-detail/services/use-explore-category"
import { useCategoryContent } from "../../content-list/services/use-category-content"
import { CategoryMapping } from "./category-mapping"

type HomeScreenProps = { categoryId: string }
export function HomeScreen({ categoryId }: HomeScreenProps) {
  const { categoryItems } = useCategoryContent({ categoryId })
  const { category, certificate } = useExploreCategory({ categoryId })

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  return (
    <SpaceBackground>
      <div
        ref={containerRef}
        className="relative z-10 flex size-full flex-col items-center justify-start gap-y-10"
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
          <OpenCategoriesButton to="/" search={{ category: "all" }} />

          <div className="shrink-0 grow-1 text-center">
            <Link
              to="/"
              search={{ category: category.categoryId, type: "details" }}
              className="font-outfit text-loops-light text-center text-sm font-medium text-wrap"
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
            categoryItems={categoryItems}
            categoryId={categoryId}
          />

          {category.startedCategory && certificate && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-full max-w-sm"
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
                      {category.name?.[0]?.content ?? "this category"}
                    </span>{" "}
                    is ready.
                  </CardDescription>
                </CardHeader>

                <CardContent className="relative">
                  <div className="rounded-xl border border-white/10 bg-black/20 p-2">
                    <img
                      src={certificate.imageURL}
                      alt="Certificate preview"
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-lg object-cover shadow-sm"
                    />
                  </div>
                </CardContent>

                <CardFooter className="relative flex flex-col gap-3">
                  <div className="grid w-full grid-cols-2 gap-2">
                    <Button asChild variant="secondary" className="w-full">
                      <a
                        href={certificate.pdfURL}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        View PDF
                      </a>
                    </Button>

                    <Button asChild variant="outline" className="w-full">
                      <a
                        href={certificate.imageURL}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        Open Image
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
