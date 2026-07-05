import { Cause, Option } from "effect"

import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { isUnknownError } from "@/server/telemetry/schema"

type UnknownError = typeof unknownErrorSchema.Type

/**
 * Handles server function failures by reporting unexpected server failures to
 * telemetry (UnknownError / defects only) and providing a fallback error if needed.
 *
 * Logical/domain failures (4xx-style codes like Unauthorized, InvalidInput) are
 * returned to the client but not recorded as exceptions.
 *
 * Uses the process-global telemetry registry so OpenTelemetry packages never
 * enter the client bundle through this shared module.
 */
export function handleServerFnFailure<E>(
  cause: Cause.Cause<E>,
): E | UnknownError {
  const failure = Option.getOrElse(
    Cause.failureOption(cause), //
    () => ({ code: "UnknownError" as const }),
  )

  if (isServerFailure(cause, failure)) {
    const defect = Option.getOrUndefined(Cause.dieOption(cause))
    globalThis.__LOOPS_TELEMETRY__?.recordException(failure, {
      cause: Cause.pretty(cause),
      defect: defect === undefined ? undefined : String(defect),
      errorCode: isUnknownError(failure) ? failure.code : "UnknownError",
      source: "handleServerFnFailure",
    })
  }

  return failure as E | UnknownError
}

/**
 * True for unexpected server failures (UnknownError, defects), not domain/logical errors.
 *
 * @param cause - Effect cause from server function execution.
 * @param failure - Squashed failure value from the cause.
 */
const isServerFailure = <E>(cause: Cause.Cause<E>, failure: unknown): boolean =>
  Option.isNone(Cause.failureOption(cause)) || isUnknownError(failure)
