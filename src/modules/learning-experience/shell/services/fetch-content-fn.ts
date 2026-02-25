import { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option, Schema } from "effect"

// --- ERROR SCHEMAS -----------------------------------------------------------
const fetchErrorSchema = Schema.Struct({
  code: Schema.Literal("FetchError"),
  message: Schema.String,
})

const networkErrorSchema = Schema.Struct({
  code: Schema.Literal("NetworkError"),
  message: Schema.String,
})

export const fetchContentErrorsSchema = Schema.Union(
  fetchErrorSchema,
  networkErrorSchema,
  unknownErrorSchema,
)

// --- TYPES (pure TS) ---------------------------------------------------------
export type FetchContentErrors = typeof fetchContentErrorsSchema.Type

export type FetchContentSuccess = {
  content: string
}

export type FetchContentWire =
  | { _tag: "Success"; value: FetchContentSuccess }
  | { _tag: "Failure"; error: FetchContentErrors }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchContentEffect = (url: string) =>
  Effect.gen(function* () {
    try {
      const response = yield* Effect.promise(() => fetch(url))

      if (!response.ok) {
        return yield* Effect.fail({
          code: "FetchError" as const,
          message: `Failed to fetch content: ${response.status} ${response.statusText}`,
        } satisfies typeof fetchErrorSchema.Type)
      }

      const content = yield* Effect.promise(() => response.text())
      return { content }
    } catch (error) {
      return yield* Effect.fail({
        code: "NetworkError" as const,
        message: `Network error while fetching content: ${error instanceof Error ? error.message : "Unknown error"}`,
      } satisfies typeof networkErrorSchema.Type)
    }
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const fetchContentFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as { url: string })
  .handler(async (ctx): Promise<FetchContentWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(fetchContentEffect(ctx.data.url))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: FetchContentWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error occurred while fetching content",
        } satisfies typeof unknownErrorSchema.Type
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
