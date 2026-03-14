import type { ReactNode } from "react"

import { useLocation, useRouter } from "@tanstack/react-router"
import { Suspense, useCallback } from "react"

import type { CategoryWithStartedCategory } from "@/modules/content-management/features/category-selection/services/explore-categories-fn"
import type { User } from "@/modules/shared/domain/entities/user"

import { useExploreCategories } from "@/modules/content-management/features/category-selection/services/use-explore-categories"
import { CategoriesListSkeleton } from "@/modules/shared/components/common/categories-list-skeleton"
import { CategoryContentSkeleton } from "@/modules/shared/components/common/category-content-skeleton"
import { CategoryDetailsSkeleton } from "@/modules/shared/components/common/category-details-skeleton"
import { LoadingScreen } from "@/modules/shared/components/common/loading-screen"
import { usePageLoading } from "@/modules/shared/hooks/use-page-loading"

import { CategoriesList } from "./components/categories-list"
import { CategoryDetails } from "./components/category-details"
import { CategoryDetailsWrapper } from "./components/category-details-wrapper"
import { ContentList } from "./components/content-list"
import { ContentListWrapper } from "./components/content-list-wrapper"

type CategorySelectionShellProps = {
  searchParams: {
    category?: string | undefined
    contentId?: string | undefined
    type?: "content" | "details" | undefined
  }
  target: ReactNode
  user: User
}

export function CategorySelectionShell({
  searchParams,
  target,
  user,
}: CategorySelectionShellProps) {
  const isLoading = usePageLoading()

  const getSkeleton = useCallback(() => {
    if (!searchParams.category || searchParams.category === "all")
      return <CategoriesListSkeleton />
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
    searchParams.category !== undefined &&
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
    type?: "content" | "details" | undefined
  }
  user: User
}) {
  const router = useRouter()
  const location = useLocation()
  const { categories } = useExploreCategories()

  const shouldRenderAllCategories =
    !searchParams.category || searchParams.category === "all"

  const handleBackNavigation = () => {
    // Hide back button - no navigation should occur
    if (searchParams.category === "all" && user.currentCategory === undefined)
      return

    // Navigate to root path
    if (searchParams.category === "all" && user.currentCategory !== undefined)
      router.navigate({ to: location.pathname as any })
    // Going back from content details to category details
    else if (searchParams.category !== "all" && searchParams.type === "content")
      router.navigate({
        search: (prev: any) => ({ ...prev, type: "details" }),
        to: location.pathname,
      } as any)
    // Going back from category details to categories list
    else if (searchParams.category !== "all" && searchParams.type === "details")
      router.navigate({
        search: (prev: any) => {
          const { category, type, ...rest } = prev
          return { ...rest, category: "all" }
        },
        to: location.pathname,
      } as any)
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
      search: (prev: any) => ({
        ...prev,
        category: category.categoryId,
        type: "details",
      }),
      to: location.pathname,
    } as any)

  const handleViewAllContent = (category: CategoryWithStartedCategory) =>
    router.navigate({
      search: (prev: any) => ({
        ...prev,
        category: category.categoryId,
        type: "content",
      }),
      to: location.pathname,
    } as any)

  return (
    <div className="relative flex-1 overflow-hidden">
      {shouldRenderAllCategories && (
        <CategoriesList
          categories={categories}
          onBack={handleBackNavigation}
          onCategorySelect={handleCategorySelect}
          showBackButton={shouldShowBackButton()}
        />
      )}

      {searchParams.category &&
        searchParams.category !== "all" &&
        searchParams.type === "details" &&
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
                onBack={handleBackNavigation}
                onViewAll={() => handleViewAllContent(cachedCategory)}
                showBackButton={shouldShowBackButton()}
                user={user}
              />
            )
          // Fallback to wrapper with data fetching for direct URL access
          return (
            <CategoryDetailsWrapper
              categoryId={searchParams.category}
              onBack={handleBackNavigation}
              onViewAll={(category) => handleViewAllContent(category)}
              showBackButton={shouldShowBackButton()}
              user={user}
            />
          )
        })()}

      {searchParams.category &&
        searchParams.category !== "all" &&
        searchParams.type === "content" &&
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
