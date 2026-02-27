import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { Button } from "@/modules/shared/components/ui/button"
import { cn } from "@/modules/shared/lib/utils"
import { animate, motion, useMotionValue } from "framer-motion"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

type Slide = {
  description: string
  id: number
  image: string
  title: string
}

const slides: Array<Slide> = [
  {
    description:
      "Dive into Loop’s, where learning to code becomes an epic adventure",
    id: 1,
    image: "../../../../assets/onboarding/1.svg",
    title: "Welcome to Loop’s",
  },
  {
    description:
      "Learn and progress in programming through exciting quests and stimulating challenges",
    id: 2,
    image: "../../../../assets/onboarding/2.svg",
    title: "Explore our coding universe",
  },
  {
    description: "Join our vibrant community of passionate coders",
    id: 3,
    image: "../../../../assets/onboarding/3.svg",
    title: "Join our community",
  },
]

type WelcomeScreenProps = { skipHandler: () => void }

export function WelcomeScreen({ skipHandler }: WelcomeScreenProps) {
  const [index, setIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  const x = useMotionValue(0)

  useLayoutEffect(() => {
    const onResize = () => {
      if (!containerRef.current) return
      const w = containerRef.current.clientWidth
      setWidth(w)
      x.set(-index * w)
    }
    onResize()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [index, x])

  useEffect(() => {
    if (width) x.set(-index * width)
  }, [index, width, x])

  const snapTo = useCallback(
    (idx: number) => {
      const target = -idx * width
      animate(x, target, {
        duration: 0.2,
        ease: "easeInOut",
        type: "tween",
      })
      setIndex(idx)
    },
    [width, x],
  )

  const onDragEnd = useCallback(() => {
    if (!width) return
    const current = x.get()
    const threshold = width / 2
    const delta = current + index * width

    if (delta < -threshold && index < slides.length - 1) {
      snapTo(index + 1)
    } else if (delta > threshold && index > 0) {
      snapTo(index - 1)
    } else {
      snapTo(index)
    }
  }, [index, width, x, snapTo])

  return (
    <SpaceBackground>
      <div className="flex h-full w-full flex-col items-center">
        <div className="flex w-full justify-end">
          <button
            className="font-outfit text-loops-white text-base font-bold"
            onClick={skipHandler}
          >
            Skip
          </button>
        </div>

        <div
          className="relative flex w-full flex-1 flex-col overflow-hidden py-10"
          ref={containerRef}
        >
          <div className="flex h-full w-full flex-col justify-center">
            <motion.div
              className="mb-5 flex w-full"
              drag="x"
              dragConstraints={{
                left: -(slides.length - 1) * width,
                right: 0,
              }}
              dragElastic={0.05}
              onDragEnd={onDragEnd}
              style={{ x }}
            >
              {slides.map((slide) => (
                <div
                  className="flex w-full shrink-0 grow-0 basis-full flex-col items-center"
                  key={slide.id}
                >
                  <img
                    alt={slide.title}
                    className="aspect-[3/2] w-10/12 max-w-md select-none"
                    draggable={false}
                    src={slide.image}
                  />
                  <div className="mt-6 flex w-10/12 max-w-md flex-col items-center gap-y-3">
                    <h2 className="font-outfit text-loops-cyan text-center text-3xl leading-tight font-bold break-words">
                      {slide.title}
                    </h2>
                    <p className="font-outfit text-loops-gray text-center text-base leading-7 tracking-tight break-words">
                      {slide.description}
                    </p>
                  </div>
                </div>
              ))}
            </motion.div>

            <div className="flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  className={cn(
                    "h-3 rounded-full transition-all duration-300 ease-in-out",
                    i === index ? "bg-loops-cyan w-8" : "bg-loops-gray/40 w-4",
                  )}
                  key={i}
                  onClick={() => snapTo(i)}
                />
              ))}
            </div>

            <Button
              className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan mt-14 w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
              onClick={() => {
                if (index === slides.length - 1) skipHandler()
                else snapTo(index + 1)
              }}
              type="button"
            >
              {index === slides.length - 1 ? "Start now" : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </SpaceBackground>
  )
}
