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
  previousSubQuizIndex: number | undefined
}

type SelectedSubQuizContextType = {
  selectedSubQuizIndex: number | undefined
  navigationState: SubQuizNavigationState
  setSelectedSubQuizIndex: (index: number) => void
  clearSelectedSubQuizIndex: () => void
  setNavigationState: (state: Partial<SubQuizNavigationState>) => void
  resetNavigationState: () => void
  navigateToSubQuiz: (params: {
    index: number
    direction: "next" | "previous"
  }) => void
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
    index: number
    direction: "next" | "previous"
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
        selectedSubQuizIndex,
        navigationState,
        setSelectedSubQuizIndex,
        clearSelectedSubQuizIndex,
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
