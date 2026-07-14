import { Predicate, Schema } from "effect"

const windowGlobalSchema = Schema.filter(
  (value: unknown): value is Window =>
    Predicate.isRecord(value) &&
    Predicate.hasProperty(value, "document") &&
    Predicate.isFunction((value as Window).fetch),
)(Schema.Unknown)

const cryptoRandomUuidSchema = Schema.filter(
  (value: unknown): value is Crypto =>
    Predicate.isRecord(value) &&
    Predicate.hasProperty(value, "randomUUID") &&
    Predicate.isFunction((value as Crypto).randomUUID),
)(Schema.Unknown)

/** True when `globalThis.crypto.randomUUID` is available. */
export function hasCryptoRandomUuid(): boolean {
  return Schema.is(cryptoRandomUuidSchema)(globalThis.crypto)
}

/** True when `globalThis.window` looks like a browser window. */
export function isBrowserRuntime(): boolean {
  return Schema.is(windowGlobalSchema)(globalThis.window)
}

/** True when not in a browser window (Node SSR / server preload). */
export function isServerRuntime(): boolean {
  return !isBrowserRuntime()
}
