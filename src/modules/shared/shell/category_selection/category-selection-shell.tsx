import { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn.server"
import { useExploreCategories } from "@/modules/content-management/features/category-selection/services/use-explore-categories"
import { CategoriesListSkeleton } from "@/modules/shared/components/common/categories-list-skeleton"
import { CategoryContentSkeleton } from "@/modules/shared/components/common/category-content-skeleton"
import { CategoryDetailsSkeleton } from "@/modules/shared/components/common/category-details-skeleton"
import { LoadingScreen } from "@/modules/shared/components/common/loading-screen"
import type { User } from "@/modules/shared/domain/entities/user"
import { usePageLoading } from "@/modules/shared/hooks/use-page-loading"
import { useRouter } from "@tanstack/react-router"
import { Suspense, useCallback, type ReactNode } from "react"
import { CategoriesList } from "./components/categories-list"
import { CategoryDetails } from "./components/category-details"
import { CategoryDetailsWrapper } from "./components/category-details-wrapper"
import { ContentList } from "./components/content-list"
import { ContentListWrapper } from "./components/content-list-wrapper"

type CategorySelectionShellProps = {
  searchParams: {
    category?: string | undefined
    type?: "details" | "content" | undefined
    contentId?: string | undefined
  }
  target: ReactNode
  user: User
}

export function CategorySelectionShell({
  target,
  user,
  searchParams,
}: CategorySelectionShellProps) {
  const isLoading = usePageLoading()

  const getSkeleton = useCallback(() => {
    if (searchParams.category === "all") return <CategoriesListSkeleton />
    if (searchParams.category !== "all" && searchParams.type === "details")
      return <CategoryDetailsSkeleton />
    if (searchParams.category !== "all" && searchParams.type === "content")
      return <CategoryContentSkeleton />
    return <CategoriesListSkeleton />
  }, [searchParams])

  if (isLoading) return <LoadingScreen />

  const noCurrentCategory = !user.currentCategory
  const isCategoryPage = searchParams.category !== undefined
  const isCategoryItemPage =
    searchParams.category &&
    searchParams.category !== "all" &&
    searchParams.type === "content" &&
    searchParams.contentId !== undefined

  const validCategorySelectionScreens =
    noCurrentCategory || (isCategoryPage && !isCategoryItemPage)

  if (validCategorySelectionScreens)
    return (
      <div className="bg-loops-background flex h-screen w-full flex-col">
        <Suspense fallback={getSkeleton()}>
          <CategorySelectionScreen searchParams={searchParams} user={user} />
        </Suspense>
      </div>
    )

  return target
}

function CategorySelectionScreen({
  searchParams,
  user,
}: {
  searchParams: {
    category?: string | undefined
    details?: boolean | undefined
  }
  user: User
}) {
  const router = useRouter()
  const { categories } = useExploreCategories()

  const handleBackNavigation = () => {
    // Hide back button - no navigation should occur
    if (searchParams.category === "all" && user.currentCategory === undefined)
      return

    // Navigate to root path
    if (searchParams.category === "all" && user.currentCategory !== undefined)
      router.navigate({ to: "/" })
    // Going back from content details to category details
    else if (searchParams.category !== "all" && searchParams.details)
      router.navigate({
        to: "/",
        search: (prev: any) => ({ ...prev, details: false }),
      })
    // Going back from category details to categories list
    else if (searchParams.category !== "all" && !searchParams.details)
      router.navigate({
        to: "/",
        search: (prev: any) => {
          const { category, details, ...rest } = prev
          return { ...rest, category: "all" }
        },
      })
  }

  const shouldShowBackButton = () => {
    // When user.currentCategory is undefined:
    // - Hide back button ONLY in "all categories" screen
    // - Show back button in all other screens
    if (user.currentCategory === undefined)
      return searchParams.category !== "all"

    return true
  }

  const handleCategorySelect = (category: CategoryWithStartedCategory) =>
    router.navigate({
      to: "/",
      search: (prev: any) => ({
        ...prev,
        category: category.categoryId,
        details: false,
      }),
    })

  const handleViewAllContent = (category: CategoryWithStartedCategory) =>
    router.navigate({
      to: "/",
      search: (prev: any) => ({
        ...prev,
        category: category.categoryId,
        details: true,
      }),
    })

  return (
    <div className="relative flex-1 overflow-hidden">
      {searchParams.category === "all" && (
        <CategoriesList
          categories={categories}
          onCategorySelect={handleCategorySelect}
          onBack={handleBackNavigation}
          showBackButton={shouldShowBackButton()}
        />
      )}

      {searchParams.category &&
        searchParams.category !== "all" &&
        !searchParams.details &&
        (() => {
          // Try to find the category in cached categories first
          const cachedCategory = categories.find(
            (cat) => cat.categoryId === searchParams.category,
          )

          // Use cached data to avoid unnecessary refetch
          if (cachedCategory)
            return (
              <CategoryDetails
                category={cachedCategory}
                user={user}
                onBack={handleBackNavigation}
                onViewAll={() => handleViewAllContent(cachedCategory)}
                showBackButton={shouldShowBackButton()}
              />
            )
          // Fallback to wrapper with data fetching for direct URL access
          return (
            <CategoryDetailsWrapper
              categoryId={searchParams.category}
              user={user}
              onBack={handleBackNavigation}
              onViewAll={(category) => handleViewAllContent(category)}
              showBackButton={shouldShowBackButton()}
            />
          )
        })()}

      {searchParams.category &&
        searchParams.category !== "all" &&
        searchParams.details &&
        (() => {
          // Try to find the category in cached categories first
          const cachedCategory = categories.find(
            (cat) => cat.categoryId === searchParams.category,
          )

          // Use cached data to avoid unnecessary refetch
          if (cachedCategory)
            return (
              <ContentList
                category={cachedCategory}
                onBack={handleBackNavigation}
                showBackButton={shouldShowBackButton()}
              />
            )
          // Fallback to wrapper with data fetching for direct URL access
          return (
            <ContentListWrapper
              categoryId={searchParams.category}
              onBack={handleBackNavigation}
              showBackButton={shouldShowBackButton()}
            />
          )
        })()}
    </div>
  )
}
