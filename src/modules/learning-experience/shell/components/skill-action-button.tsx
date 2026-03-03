import { useState } from "react"
import { useTranslation } from "react-i18next"

import { useSkillStepper } from "./skill-stepper"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useContentNavigation } from "@/modules/shared/navigation"
import { VoucherDialog } from "@/modules/shared/shell/category_selection/components/voucher-dialog"
import { useCompleteSkill } from "@/modules/shared/shell/category_selection/hooks/use-complete-skill"

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

  const [isLoading, setIsLoading] = useState(false)
  const [isVoucherDialogOpen, setIsVoucherDialogOpen] = useState(false)

  // Check if current item is started (has completedSkill but not completed)
  const isStarted =
    skillItem.itemProgress && !skillItem.itemProgress.isCompleted

  // Check if current item is completed
  const isCompleted =
    skillItem.itemProgress && skillItem.itemProgress.isCompleted

  const validateSkill = async () => {
    setIsLoading(true)

    const response = await handleCompleteSkill({
      categoryId: skillItem.categoryId,
      skillId: skillItem.itemId,
    })

    setIsLoading(false)

    if (response._tag === "Success") success(t("skill.completed"))
    else error(t("skill.failed"))
  }

  const handleCompletedItemClick = async () => {
    setIsLoading(true)

    // Check if we can navigate to next item
    const canNavigate = canNavigateNext && isNextItemCompleted

    if (canNavigate) {
      // Normal navigation - next item is already started
      setIsLoading(false)
      return await navigateToNext()
    }

    // Try to start the next item and navigate to it
    const response = await validateAndStartItem()

    setIsLoading(false)

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
      <button
        className="font-outfit text-loops-light w-full max-w-sm rounded-xl bg-cyan-400 px-6 py-3 text-lg font-medium transition-all duration-200 hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
        onClick={handleButtonClick}
      >
        {isLoading
          ? t("common.loading")
          : isCompleted
            ? t("common.next")
            : t("common.validate")}
      </button>

      <VoucherDialog
        categoryId={skillItem.categoryId}
        description="Your 3 free trials are over. Submit a voucher code to continue learning. Contact the admin for a code."
        onOpenChange={setIsVoucherDialogOpen}
        open={isVoucherDialogOpen}
        showFreeTrial={false}
        showTrigger={false}
        title="Free trial limit reached"
      />
    </>
  )
}
