import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { ChevronRight } from "lucide-react"
import { useSkillStepper } from "../skill-stepper"

type SkillWelcomeScreenProps = {
  skillItem: CategoryContentItem & { contentType: "skills" }
}

export function SkillWelcomeScreen({ skillItem }: SkillWelcomeScreenProps) {
  const { goToStep } = useSkillStepper()

  const isStarted = !!skillItem.itemProgress

  return (
    <div className="font-outfit bg-loops-background relative flex h-full w-full flex-col items-center justify-center">
      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-[#15153a] px-4 py-6">
        <h1 className="text-center text-2xl font-semibold tracking-tight">
          <span className="text-loops-orange">Skill:</span>{" "}
          <span className="text-loops-light">
            {skillItem.content.label[0].content}
          </span>
        </h1>

        <div className="w-full">
          <div className="overflow-hidden rounded-2xl shadow-[0px_4px_0px_0px_#31BCE6]">
            <img
              src={skillItem.content.cover.urls?.[20]}
              alt={skillItem.content.cover.alt}
              title={skillItem.content.cover.title}
              aria-description={skillItem.content.cover.description}
              className="h-56 w-full object-cover"
            />
          </div>
        </div>

        <button
          onClick={() => goToStep("content")}
          className="font-outfit flex w-full items-center justify-center gap-1 rounded-xl bg-cyan-400 px-6 py-3 text-lg font-medium text-[#15153a] transition-all duration-200 hover:bg-cyan-500"
        >
          <span className="text-[18px] font-medium">
            {isStarted ? "Continue" : "Start"}
          </span>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
