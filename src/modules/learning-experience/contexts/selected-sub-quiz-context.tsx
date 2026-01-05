import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react"

type SubQuizNavigationState = {
  isNavigating: boolean
  navigationDirection: "next" | "previous" | undefined
  previousSubQuiz: EnhancedSubQuiz | undefined
}

type SelectedSubQuizContextType = {
  selectedSubQuiz: EnhancedSubQuiz | undefined
  navigationState: SubQuizNavigationState
  setSelectedSubQuiz: (subQuiz: EnhancedSubQuiz) => void
  clearSelectedSubQuiz: () => void
  setNavigationState: (state: Partial<SubQuizNavigationState>) => void
  resetNavigationState: () => void
  navigateToSubQuiz: (params: {
    subQuiz: EnhancedSubQuiz
    direction: "next" | "previous"
  }) => void
}

const SelectedSubQuizContext = createContext({} as SelectedSubQuizContextType)

const initialNavigationState: SubQuizNavigationState = {
  isNavigating: false,
  navigationDirection: undefined,
  previousSubQuiz: undefined,
}

export function SelectedSubQuizProvider({ children }: PropsWithChildren) {
  const [selectedSubQuiz, setSelectedSubQuizInternal] =
    useState<EnhancedSubQuiz>()
  const [navigationState, setNavigationStateInternal] =
    useState<SubQuizNavigationState>(initialNavigationState)

  const setSelectedSubQuiz = (subQuiz: EnhancedSubQuiz) =>
    setSelectedSubQuizInternal(subQuiz)

  const clearSelectedSubQuiz = () => {
    setNavigationStateInternal(initialNavigationState)
    setSelectedSubQuizInternal(undefined)
  }

  const setNavigationState = (state: Partial<SubQuizNavigationState>) =>
    setNavigationStateInternal((prev) => ({ ...prev, ...state }))

  const resetNavigationState = useCallback(() => {
    setNavigationStateInternal(initialNavigationState)
  }, [])

  const navigateToSubQuiz = (params: {
    subQuiz: EnhancedSubQuiz
    direction: "next" | "previous"
  }) => {
    setNavigationStateInternal({
      isNavigating: true,
      navigationDirection: params.direction,
      previousSubQuiz: selectedSubQuiz,
    })
    setSelectedSubQuizInternal(params.subQuiz)
  }

  return (
    <SelectedSubQuizContext.Provider
      value={{
        selectedSubQuiz,
        navigationState,
        setSelectedSubQuiz,
        clearSelectedSubQuiz,
        setNavigationState,
        resetNavigationState,
        navigateToSubQuiz,
      }}
    >
      {children}
    </SelectedSubQuizContext.Provider>
  )
}

export function useSelectedSubQuiz() {
  return useContext(SelectedSubQuizContext)
}
