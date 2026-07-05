import { Either, Schema } from "effect"

/** Full call path stack as JSON. */
export const CALL_STACK_HEADER = "x-loops-call-stack"

export const apiCallSourceSchema = Schema.Literal(
  "api",
  "beforeLoad",
  "component",
  "hook",
  "loader",
  "mutation",
  "query.fetch",
  "query.invalidate",
  "query.prefetch",
  "query.refetch",
  "query.suspense",
  "route",
  "serverFn",
  "tokenRefresh",
  "unknown",
)

/** Who initiated an outbound API dependency call. */
export type ApiCallSource = typeof apiCallSourceSchema.Type

export const apiCallContextSchema = Schema.Struct({
  name: Schema.optional(Schema.String),
  queryKey: Schema.optional(Schema.String),
  routeId: Schema.optional(Schema.String),
  triggeredBy: Schema.optional(apiCallSourceSchema),
  type: apiCallSourceSchema,
})

/** One frame in the call path stack. */
export type ApiCallContext = typeof apiCallContextSchema.Type

const apiCallStackJsonSchema = Schema.parseJson(
  Schema.Array(apiCallContextSchema),
)

/** Decode full call path stack from request header. */
export function parseCallStackHeader(
  value: null | string | undefined,
): Array<ApiCallContext> | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined

  const stackDecoder = Schema.decodeUnknownEither(apiCallStackJsonSchema)
  const stackResult = stackDecoder(trimmed)

  if (Either.isRight(stackResult)) return [...stackResult.right]

  return undefined
}

/** Encode full call path stack for propagation on server-function HTTP requests. */
export const serializeCallStack = (
  stack: ReadonlyArray<ApiCallContext>,
): string => JSON.stringify(stack)
