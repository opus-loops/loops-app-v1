import { captureException } from "@sentry/tanstackstart-react"
import { Cause, Option } from "effect"

/**
 * Handles server function failures by reporting them to Sentry
 * and providing a fallback error if needed.
 *
 * @param cause - The Cause from an Effect Exit failure
 * @returns The failure value or a fallback UnknownError
 */
export function handleServerFnFailure<E>(
  cause: Cause.Cause<E>,
): E | { code: "UnknownError" } {
  const failure = Option.getOrElse(Cause.failureOption(cause), () => ({
    code: "UnknownError" as const,
  }))

  // Report to Sentry
  captureException(failure, {
    extra: {
      cause: Cause.pretty(cause),
    },
  })

  return failure as E | { code: "UnknownError" }
}
