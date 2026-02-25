import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import { Button } from "@/modules/shared/components/ui/button"
import type { User } from "@/modules/shared/domain/entities/user"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { VoucherDialog } from "./voucher-dialog"

type CategoryActionButtonProps = {
  category: CategoryWithStartedCategory
  user: User
}

export function CategoryActionButton({
  category,
  user,
}: CategoryActionButtonProps) {
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleContinueLearning = async () => {
    // If user.currentCategory matches current category ID, only navigate
    if (user.currentCategory === category.categoryId) {
      await router.navigate({ to: "/", search: {} })
      return
    }

    // TODO: Make API call to update current category
    // For now, just invalidate queries and navigate
    await queryClient.invalidateQueries({
      queryKey: ["authenticated"],
    })

    await router.navigate({ to: "/", search: {} })
  }

  // For non-started categories, show voucher dialog
  if (category.startedCategory === undefined)
    return <VoucherDialog categoryId={category.categoryId} />

  // For started categories, show continue button
  return (
    <Button
      className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none transition-all duration-200"
      type="button"
      onClick={handleContinueLearning}
    >
      Continue Learning
    </Button>
  )
}
