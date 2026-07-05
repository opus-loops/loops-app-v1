import { AsyncLocalStorage } from "node:async_hooks"

import type { ApiCallContext } from "@/modules/shared/telemetry/call-context.types"

import { isServerRuntime } from "@/modules/shared/telemetry/runtime"

const callContextStorage = new AsyncLocalStorage<Array<ApiCallContext>>()

/** Current nested call-site context (innermost frame). Server only. */
export function getCallContext(): ApiCallContext | undefined {
  return getCallContextStack().at(-1)
}

/** Full nested call path on the server ALS stack. */
export function getCallContextStack(): Array<ApiCallContext> {
  if (!isServerRuntime()) return []
  return callContextStorage.getStore() ?? []
}

/** Run work with call-site context pushed onto the ALS stack. */
export function runWithCallContext<T>(
  context: ApiCallContext,
  fn: () => Promise<T> | T,
): Promise<T> | T {
  if (!isServerRuntime()) return fn()

  const stack = callContextStorage.getStore() ?? []
  const nextStack = [...stack, context]
  return callContextStorage.run(nextStack, fn)
}

/** Replace ALS stack with an inbound path before running server work. */
export function runWithCallContextStack<T>(
  stack: ReadonlyArray<ApiCallContext>,
  fn: () => Promise<T> | T,
): Promise<T> | T {
  if (!isServerRuntime()) return fn()
  return callContextStorage.run([...stack], fn)
}
