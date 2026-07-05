import type { ApiCallContext } from "./call-context.types"

import { runSyncExitOrElse } from "./effect"
import { isBrowserRuntime } from "./runtime"

const clientCallContextStack: Array<ApiCallContext> = []
const reactCallPathStack: Array<Array<ApiCallContext>> = []
const hookCallPathSegments: Array<ApiCallContext> = []

type ServerCallContextBridge = {
  get: () => ApiCallContext | undefined
  getStack: () => Array<ApiCallContext>
  run: <T>(context: ApiCallContext, fn: () => Promise<T> | T) => Promise<T> | T
  runWithStack: <T>(
    stack: ReadonlyArray<ApiCallContext>,
    fn: () => Promise<T> | T,
  ) => Promise<T> | T
}

let serverBridge: ServerCallContextBridge | undefined

/** Pop innermost React call path after {@link TraceRegion} unmounts. */
export function popReactCallPath(): void {
  reactCallPathStack.pop()
}

/** Push React component/route path while a {@link TraceRegion} is mounted. */
export function pushReactCallPath(path: ReadonlyArray<ApiCallContext>): void {
  reactCallPathStack.push([...path])
}

/** Read innermost merged call context frame. */
export function readCallContext(): ApiCallContext | undefined {
  return readCallContextStack().at(-1)
}

/** Full merged path: React tree + hooks + runtime execution stack. */
export function readCallContextStack(): Array<ApiCallContext> {
  return [
    ...readReactCallPath(),
    ...hookCallPathSegments,
    ...readRuntimeCallContextStack(),
  ]
}

/** Active React call path from nested {@link TraceRegion} providers. */
export function readReactCallPath(): Array<ApiCallContext> {
  return reactCallPathStack.at(-1) ?? []
}

/** Runtime call frames (beforeLoad, query, serverFn, …). */
export function readRuntimeCallContextStack(): Array<ApiCallContext> {
  if (isBrowserRuntime()) return [...clientCallContextStack]
  return serverBridge?.getStack() ?? []
}

/** Register a hook frame for the active component render lifecycle. */
export function registerHookCallPathSegment(frame: ApiCallContext): () => void {
  hookCallPathSegments.push(frame)
  return () => {
    const index = hookCallPathSegments.lastIndexOf(frame)
    if (index >= 0) hookCallPathSegments.splice(index, 1)
  }
}

/** Installed from server-only telemetry setup (never from client bundle). */
export function registerServerCallContextBridge(
  bridge: ServerCallContextBridge,
): void {
  serverBridge = bridge
}

/**
 * Run work under a call-site context.
 *
 * Client: in-memory stack + optional header on `/_serverFn` fetch (see install hook).
 * Server: AsyncLocalStorage bridge registered at telemetry startup.
 */
export function runWithCallContext<T>(
  context: ApiCallContext,
  fn: () => Promise<T> | T,
): Promise<T> | T {
  if (isBrowserRuntime()) {
    clientCallContextStack.push(context)
    return runSyncExitOrElse(
      () => {
        const result = fn()
        if (result instanceof Promise) {
          return result.finally(() => {
            clientCallContextStack.pop()
          })
        }
        clientCallContextStack.pop()
        return result
      },
      (error) => {
        clientCallContextStack.pop()
        throw error
      },
    )
  }

  if (serverBridge) return serverBridge.run(context, fn)
  return fn()
}

/** Run work under an inbound call stack replayed on the server. */
export function runWithInboundCallStack<T>(
  stack: ReadonlyArray<ApiCallContext>,
  fn: () => Promise<T> | T,
): Promise<T> | T {
  if (isBrowserRuntime()) return fn()
  if (serverBridge) return serverBridge.runWithStack(stack, fn)
  return fn()
}
