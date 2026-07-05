import { useLayoutEffect, useMemo } from "react"

import type { ApiCallSource } from "./call-context.types"

import { registerHookCallPathSegment } from "./run-with-call-context"

/** Register a hook frame on the active call path for the component lifetime. */
export function useCallPathSegment(type: ApiCallSource, name: string): void {
  const frame = useMemo(() => ({ name, type }), [name, type])

  useLayoutEffect(() => registerHookCallPathSegment(frame), [frame])
}
