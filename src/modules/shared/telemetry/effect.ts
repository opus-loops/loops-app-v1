/**
 * Effect-based sync control flow for shared modules (no try/catch).
 */
import { Cause, Effect } from "effect"

/** Run synchronous work; on failure invoke `onFailure` with squashed cause. */
export function runSyncExitOrElse<A>(
  thunk: () => A,
  onFailure: (error: unknown) => A,
): A {
  const exit = Effect.runSyncExit(
    Effect.try({
      catch: (error) => error,
      try: thunk,
    }),
  )

  if (exit._tag === "Failure") {
    return onFailure(Cause.squash(exit.cause))
  }

  return exit.value
}

/** Run synchronous work; return `fallback` on any thrown error. */
export const runSyncOrElse = <A>(thunk: () => A, fallback: A): A =>
  Effect.runSync(
    Effect.merge(
      Effect.try({
        catch: () => fallback,
        try: thunk,
      }),
    ),
  )
