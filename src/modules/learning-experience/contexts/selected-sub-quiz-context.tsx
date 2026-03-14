import type { PropsWithChildren } from "react"

import { createContext, useCallback, useContext, useState } from "react"

type SelectedSubQuizContextType = {
  clearSelectedSubQuizIndex: () => void
  navigateToSubQuiz: (params: {
    direction: "next" | "previous"
    index: number
  }) => void
  navigationState: SubQuizNavigationState
  resetNavigationState: () => void
  selectedSubQuizIndex: number | undefined
  setNavigationState: (state: Partial<SubQuizNavigationState>) => void
  setSelectedSubQuizIndex: (index: number) => void
}

type SubQuizNavigationState = {
  isNavigating: boolean
  navigationDirection: "next" | "previous" | undefined
  previousSubQuizIndex: number | undefined
}

const SelectedSubQuizContext = createContext({} as SelectedSubQuizContextType)

const initialNavigationState: SubQuizNavigationState = {
  isNavigating: false,
  navigationDirection: undefined,
  previousSubQuizIndex: undefined,
}

export function SelectedSubQuizProvider({ children }: PropsWithChildren) {
  const [selectedSubQuizIndex, setSelectedSubQuizIndexInternal] =
    useState<number>()
  const [navigationState, setNavigationStateInternal] =
    useState<SubQuizNavigationState>(initialNavigationState)

  const setSelectedSubQuizIndex = (index: number) =>
    setSelectedSubQuizIndexInternal(index)

  const clearSelectedSubQuizIndex = () => {
    setNavigationStateInternal(initialNavigationState)
    setSelectedSubQuizIndexInternal(undefined)
  }

  const setNavigationState = (state: Partial<SubQuizNavigationState>) =>
    setNavigationStateInternal((prev) => ({ ...prev, ...state }))

  const resetNavigationState = useCallback(() => {
    setNavigationStateInternal(initialNavigationState)
  }, [])

  const navigateToSubQuiz = (params: {
    direction: "next" | "previous"
    index: number
  }) => {
    setNavigationStateInternal({
      isNavigating: true,
      navigationDirection: params.direction,
      previousSubQuizIndex: selectedSubQuizIndex,
    })
    setSelectedSubQuizIndexInternal(params.index)
  }

  return (
    <SelectedSubQuizContext.Provider
      value={{
        clearSelectedSubQuizIndex,
        navigateToSubQuiz,
        navigationState,
        resetNavigationState,
        selectedSubQuizIndex,
        setNavigationState,
        setSelectedSubQuizIndex,
      }}
    >
      {children}
    </SelectedSubQuizContext.Provider>
  )
}

export function useSelectedSubQuiz() {
  return useContext(SelectedSubQuizContext)
}
