import { Suspense } from "react"
import { SelectedContentScreen } from "./components/selected-content-screen"
import { SelectedContentWrapper } from "./components/selected-content-wrapper"
import type { ReactNode } from "react"

import { ContentScreenSkeleton } from "@/modules/shared/components/common/content-screen-skeleton"
import { LoadingScreen } from "@/modules/shared/components/common/loading-screen"
import { useSelectedContent } from "@/modules/shared/contexts/selected-content-context"
import { usePageLoading } from "@/modules/shared/hooks/use-page-loading"

type SelectedContentShellProps = {
  searchParams: {
    category?: string | undefined
    contentId?: string | undefined
    type?: "content" | "details" | undefined
  }
  target: ReactNode
}

export function SelectedContentShell({
  searchParams,
  target,
}: SelectedContentShellProps) {
  const isLoading = usePageLoading()
  const { selectedItem } = useSelectedContent()

  if (isLoading) return <LoadingScreen />

  const cachedItemMatchesRequest =
    selectedItem &&
    searchParams.category === selectedItem.categoryId &&
    selectedItem.categoryItemId === searchParams.contentId

  if (
    searchParams.category &&
    searchParams.category !== "all" &&
    searchParams.type === "content" &&
    searchParams.contentId !== undefined
  )
    return (
      <div className="bg-loops-background flex h-screen w-full flex-col">
        <Suspense fallback={<ContentScreenSkeleton />}>
          {cachedItemMatchesRequest && (
            <SelectedContentScreen selectedItem={selectedItem} />
          )}

          {!cachedItemMatchesRequest && (
            <SelectedContentWrapper
              categoryId={searchParams.category}
              contentId={searchParams.contentId}
            />
          )}
        </Suspense>
      </div>
    )

  return target
}
