import { useState } from "react"
import { useTranslation } from "react-i18next"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useContentNavigation } from "@/modules/shared/navigation"
import { FreeTrialDialog } from "@/modules/shared/shell/category_selection/components/free-trial-dialog"
import { useCompleteSkill } from "@/modules/shared/shell/category_selection/hooks/use-complete-skill"

import { useSkillStepper } from "./skill-stepper"

type SkillActionButtonProps = {
  skillItem: { contentType: "skills" } & CategoryContentItem
}

export function SkillActionButton({ skillItem }: SkillActionButtonProps) {
  const { handleCompleteSkill } = useCompleteSkill()
  const { error, success } = useToast()
  const { t } = useTranslation()

  const {
    canNavigateNext,
    isNextItemCompleted,
    navigateToNext,
    validateAndStartItem,
  } = useContentNavigation({ categoryId: skillItem.categoryId })

  const { goToStep } = useSkillStepper()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)

  // Check if current item is started (has completedSkill but not completed)
  const isStarted =
    skillItem.itemProgress && !skillItem.itemProgress.isCompleted

  // Check if current item is completed
  const isCompleted =
    skillItem.itemProgress && skillItem.itemProgress.isCompleted

  const validateSkill = async () => {
    setIsSubmitting(true)

    const response = await handleCompleteSkill({
      categoryId: skillItem.categoryId,
      skillId: skillItem.itemId,
    })

    setIsSubmitting(false)

    if (response._tag === "Success") success(t("skill.completed"))
    else error(t("skill.failed"))
  }

  const handleCompletedItemClick = async () => {
    setIsSubmitting(true)

    // Check if we can navigate to next item
    const canNavigate = canNavigateNext && isNextItemCompleted

    if (canNavigate) {
      // Normal navigation - next item is already started
      setIsSubmitting(false)
      return await navigateToNext()
    }

    // Try to start the next item and navigate to it
    const response = await validateAndStartItem()

    setIsSubmitting(false)

    // Successfully started next item, now navigate
    if (
      response._tag === "Failure" &&
      response.error.code === "max_free_items_reached"
    ) {
      setIsVoucherDialogOpen(true)
      return
    }

    if (response._tag === "Success") {
      await navigateToNext()
      goToStep("welcome")
    }
  }

  const handleButtonClick = () => {
    if (isCompleted) handleCompletedItemClick()
    else if (isStarted) validateSkill()
  }

  return (
    <>
      <Button
        className="font-outfit text-loops-light hover:bg-loops-cyan/90 bg-loops-cyan w-full max-w-sm rounded-xl px-6 py-3 text-lg font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting}
        onClick={handleButtonClick}
        type="button"
      >
        {isSubmitting
          ? t("common.loading")
          : isCompleted
            ? t("common.next")
            : t("common.validate")}
      </Button>

      <FreeTrialDialog
        categoryId={skillItem.categoryId}
        onOpenChange={setIsVoucherDialogOpen}
        open={isVoucherDialogOpen}
      />
    </>
  )
}
