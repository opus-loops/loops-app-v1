import type { PropsWithChildren } from "react"

import { createContext, useContext, useLayoutEffect, useMemo } from "react"

import type { ApiCallContext, ApiCallSource } from "./call-context.types"

import { popReactCallPath, pushReactCallPath } from "./run-with-call-context"

const CallPathContext = createContext<Array<ApiCallContext>>([])

type TraceRegionProps = PropsWithChildren<{
  name: string
  type?: ApiCallSource | undefined
}>

/**
 * Push a component/route frame onto the active call path while mounted.
 *
 * Nest regions to build paths like `__root > Home > OnboardingShell > useAuth`.
 */
export function TraceRegion({
  children,
  name,
  type = "component",
}: TraceRegionProps) {
  const parent = useContext(CallPathContext)
  const path = useMemo(() => [...parent, { name, type }], [name, parent, type])

  useLayoutEffect(() => {
    pushReactCallPath(path)
    return () => popReactCallPath()
  }, [path])

  return (
    <CallPathContext.Provider value={path}>{children}</CallPathContext.Provider>
  )
}
