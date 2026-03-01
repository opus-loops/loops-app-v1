import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { HalfStarIcon } from "@/modules/shared/components/icons/half-star"
import { OpenCategoriesButton } from "@/modules/shared/components/navigation/open-categories-button"
import { Link } from "@tanstack/react-router"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { useExploreCategory } from "../../content-detail/services/use-explore-category"
import { useCategoryContent } from "../../content-list/services/use-category-content"
import { CategoryMapping } from "./category-mapping"

type HomeScreenProps = { categoryId: string }
export function HomeScreen({ categoryId }: HomeScreenProps) {
  const { categoryItems } = useCategoryContent({ categoryId })
  const { category } = useExploreCategory({ categoryId })

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
        </div>
      </div>
    </SpaceBackground>
  )
}
