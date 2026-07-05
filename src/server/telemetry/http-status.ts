import { redactErrorMessage } from "./redact"
import { isErrorInstance } from "./schema"

/** True for infrastructure failures: missing status or HTTP 5xx. */
export function isServerErrorStatus(statusCode: number | undefined): boolean {
  return statusCode === undefined || statusCode >= 500
}

/** Map HTTP status code to metric attribute bucket (`1xx`–`5xx`). */
export function statusClass(statusCode: number): string {
  if (statusCode >= 500) return "5xx"
  if (statusCode >= 400) return "4xx"
  if (statusCode >= 300) return "3xx"
  if (statusCode >= 200) return "2xx"
  return "1xx"
}

/** Coerce unknown thrown values to Error with redacted message. */
export function toError(error: unknown): Error {
  if (isErrorInstance(error)) return error
  return new Error(redactErrorMessage(error))
}
