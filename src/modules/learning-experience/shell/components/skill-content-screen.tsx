import { ContentSkeleton } from "@/components/ui/content-skeleton"
import { BottomTabNavigator } from "@/modules/shared/components/navigation/bottom-tab-navigator"
import { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { SkillContent } from "@/modules/shared/domain/entities/skill-content"
import { BackButton } from "@/modules/shared/shell/category_selection/components/back-button"
import { Suspense } from "react"
import { SkillActionButton } from "./skill-action-button"
import { SkillContentRenderer } from "./skill-content-renderer"
import { SkillStepper } from "./skill-stepper"
import { SkillWelcomeScreen } from "./steps/skill-welcome-screen"

type SkillContentScreenProps = {
  skillItem: CategoryContentItem & { contentType: "skills" }
  onBack: () => void
}

export function SkillContentScreen({
  skillItem,
  onBack,
}: SkillContentScreenProps) {
  const skillContent = skillItem.skillContent as SkillContent

  const contentUrl = skillContent.contentURL[0].content

  return (
    <div className="bg-loops-background flex h-full flex-col">
      <div className="relative flex items-center justify-center px-4 py-6">
        <BackButton onBack={onBack} />
      </div>

      <div className="mx-auto mb-28 w-full max-w-sm flex-1 overflow-y-auto px-4">
        <Suspense fallback={<ContentSkeleton />}>
          <SkillStepper
            skillItem={skillItem}
            welcome={<SkillWelcomeScreen skillItem={skillItem} />}
            content={
              <div className="flex flex-col items-start">
                <SkillContentRenderer contentUrl={contentUrl} />
                <SkillActionButton skillItem={skillItem} />
              </div>
            }
          />
        </Suspense>
      </div>

      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2">
        <BottomTabNavigator />
      </div>
    </div>
  )
}
