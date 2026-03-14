import type { PropsWithChildren } from "react"

import { createContext, useCallback, useContext, useState } from "react"

import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"

type NavigationState = {
  isNavigating: boolean
  navigationDirection: "next" | "previous" | null
  previousItem: CategoryContentItem | null
}

type SelectedContentContextType = {
  clearSelectedContent: () => void
  navigateToItem: (params: {
    direction: "next" | "previous"
    item: CategoryContentItem
  }) => void
  navigationState: NavigationState
  resetNavigationState: () => void
  selectedItem: CategoryContentItem | undefined
  setNavigationState: (state: Partial<NavigationState>) => void
  setSelectedContent: (item: CategoryContentItem) => void
}

const SelectedContentContext = createContext({} as SelectedContentContextType)

const initialNavigationState: NavigationState = {
  isNavigating: false,
  navigationDirection: null,
  previousItem: null,
}

export function SelectedContentProvider({ children }: PropsWithChildren) {
  const [selectedItem, setSelectedItem] = useState<CategoryContentItem>()
  const [navigationState, setNavigationStateInternal] =
    useState<NavigationState>(initialNavigationState)

  const setSelectedContent = (item: CategoryContentItem) =>
    setSelectedItem(item)

  const clearSelectedContent = () => {
    setNavigationStateInternal(initialNavigationState)
    setSelectedItem(undefined)
  }

  const setNavigationState = (state: Partial<NavigationState>) =>
    setNavigationStateInternal((prev) => ({ ...prev, ...state }))

  const resetNavigationState = useCallback(() => {
    setNavigationStateInternal(initialNavigationState)
  }, [])

  const navigateToItem = (params: {
    direction: "next" | "previous"
    item: CategoryContentItem
  }) => {
    setNavigationStateInternal({
      isNavigating: true,
      navigationDirection: params.direction,
      previousItem: selectedItem || null,
    })
    setSelectedItem(params.item)
  }

  return (
    <SelectedContentContext.Provider
      value={{
        clearSelectedContent,
        navigateToItem,
        navigationState,
        resetNavigationState,
        selectedItem,
        setNavigationState,
        setSelectedContent,
      }}
    >
      {children}
    </SelectedContentContext.Provider>
  )
}

export function useSelectedContent() {
  return useContext(SelectedContentContext)
}
