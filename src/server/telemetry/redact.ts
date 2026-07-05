/**
 * Redact sensitive keys and string patterns before telemetry export.
 *
 * Applied to span attributes, log events, and error messages in {@link ./setup}.
 */
import { Schema } from "effect"

import { runSyncOrElse } from "./effect"
import { isErrorInstance, isPlainObject, isString } from "./schema"

const SENSITIVE_KEY_PATTERN =
  /^(authorization|cookie|set-cookie|password|passwd|secret|token|access[_-]?token|refresh[_-]?token|api[_-]?key|session|ssn|email|phone|credit[_-]?card)$/i

const BEARER_PATTERN = /Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi
const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
const JWT_PATTERN = /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g

const REDACTED = "[REDACTED]"

/**
 * True when an attribute key should be fully redacted (tokens, passwords, PII keys).
 *
 * @param key - Attribute or object property name.
 */
export function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key)
}

/**
 * Deep-redact an attribute object: sensitive keys → `[REDACTED]`, strings scrubbed.
 *
 * @param attributes - Raw attributes; `undefined` returns `{}`.
 */
export function redactAttributes(
  attributes: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!attributes) return {}

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(attributes)) {
    if (isSensitiveKey(key)) {
      result[key] = REDACTED
      continue
    }
    result[key] = redactValue(value)
  }
  return result
}

/**
 * Produce a safe string from an unknown error for spans and logs.
 *
 * @param error - Error instance, string, or serializable value.
 */
export function redactErrorMessage(error: unknown): string {
  if (isErrorInstance(error)) {
    return redactString(error.message)
  }
  if (isString(error)) {
    return redactString(error)
  }
  return runSyncOrElse(() => redactString(JSON.stringify(error)), REDACTED)
}

/**
 * Recursively redact strings inside arrays and plain objects.
 *
 * @param value - Primitive, array, or object to sanitize.
 */
export function redactValue(value: unknown): unknown {
  if (isString(value)) {
    return redactString(value)
  }

  if (Schema.is(Schema.Array(Schema.Unknown))(value)) {
    return value.map((item) => redactValue(item))
  }

  if (isPlainObject(value)) {
    return redactAttributes(value)
  }

  return value
}

/** Scrub bearer tokens, JWTs, and email addresses from a string. */
function redactString(value: string): string {
  return value
    .replace(BEARER_PATTERN, `Bearer ${REDACTED}`)
    .replace(JWT_PATTERN, REDACTED)
    .replace(EMAIL_PATTERN, REDACTED)
}
