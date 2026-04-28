import { useRouter } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import type { User } from "@/modules/shared/domain/entities/user"

import { useUpdateCurrentCategory } from "@/modules/profile/hooks/use-update-current-category"
import { Button } from "@/modules/shared/components/ui/button"
import { VoucherStepperDialog } from "@/modules/shared/shell/category_selection/components/voucher-stepper-dialog"

import { FreeTrialDialog } from "./free-trial-dialog"

type CategoryActionButtonProps = {
  category: CategoryWithStartedCategory
  user: User
}

export function CategoryActionButton({
  category,
  user,
}: CategoryActionButtonProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleUpdateCurrentCategory } = useUpdateCurrentCategory()

  const handleContinueLearning = async () => {
    // If user.currentCategory matches current category ID, only navigate
    if (user.currentCategory === category.categoryId) {
      await router.navigate({ search: {}, to: "/" })
      return
    }

    await handleUpdateCurrentCategory(category.categoryId)

    await router.navigate({ search: {}, to: "/" })
  }

  // For non-started categories, show voucher dialog
  if (category.startedCategory === undefined)
    return <VoucherStepperDialog categoryId={category.categoryId} />

  // For started categories, show continue button
  return (
    <Button
      className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200"
      onClick={handleContinueLearning}
      type="button"
    >
      {t("common.continue_learning")}
    </Button>
  )
}
