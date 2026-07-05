/**
 * Effect-based control flow for telemetry (no try/catch in telemetry modules).
 *
 * Used by request/middleware wrappers and sync setup paths.
 */
import { isRedirect } from "@tanstack/react-router"
import { Cause, Effect } from "effect"

export {
  runSyncExitOrElse,
  runSyncOrElse,
} from "@/modules/shared/telemetry/effect"

/**
 * Run async work as Effect Exit; record exception and rethrow on failure.
 *
 * Preserves TanStack Start error flow while ensuring telemetry capture.
 *
 * @param options.try - Async work to execute.
 * @param options.recordException - Called with error and optional attributes on failure.
 * @param options.onFinally - Called with `failed` flag after success or failure.
 * @param options.attributes - Attributes attached to recorded exceptions.
 */
export async function runTelemetryExit<A>(options: {
  attributes?: Record<string, boolean | number | string | undefined>
  onFinally?: (failed: boolean) => void
  recordException: (
    error: unknown,
    attributes?: Record<string, boolean | number | string | undefined>,
  ) => void
  try: () => A | Promise<A>
}): Promise<A> {
  const exit = await Effect.runPromiseExit(
    Effect.tryPromise({
      catch: (error) => error,
      try: async () => await options.try(),
    }),
  )

  if (exit._tag === "Failure") {
    const error = Cause.squash(exit.cause)
    if (isRedirect(error)) throw error
    options.recordException(error, options.attributes)
    options.onFinally?.(true)
    throw error
  }

  options.onFinally?.(false)
  return exit.value
}
