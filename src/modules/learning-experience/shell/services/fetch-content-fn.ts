import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option, Schema } from "effect"

import { skillContentSchema } from "../../domain/entities/skill-content"
import type { SkillContent } from "../../domain/entities/skill-content"
import { unknownErrorSchema } from "@/modules/shared/utils/types"

// --- ERROR SCHEMAS -----------------------------------------------------------
const fetchErrorSchema = Schema.Struct({
  code: Schema.Literal("FetchError"),
})

const networkErrorSchema = Schema.Struct({
  code: Schema.Literal("NetworkError"),
})

const validationErrorSchema = Schema.Struct({
  code: Schema.Literal("ValidationError"),
})

export const fetchContentErrorsSchema = Schema.Union(
  fetchErrorSchema,
  networkErrorSchema,
  validationErrorSchema,
  unknownErrorSchema,
)

// --- TYPES (pure TS) ---------------------------------------------------------
export type FetchContentErrors = typeof fetchContentErrorsSchema.Type

export type FetchContentSuccess = {
  content: SkillContent
}

export type FetchContentWire =
  | { _tag: "Failure"; error: FetchContentErrors }
  | { _tag: "Success"; value: FetchContentSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchContentEffect = (url: string) =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        catch: (error) =>
          ({
            code: "NetworkError" as const,
          }) satisfies typeof networkErrorSchema.Type,
        try: () => fetch(url),
      }),
    )

    if (!response.ok) {
      return yield* _(
        Effect.fail({
          code: "FetchError" as const,
        } satisfies typeof fetchErrorSchema.Type),
      )
    }

    const json = yield* _(
      Effect.tryPromise({
        catch: (error) =>
          ({
            code: "NetworkError" as const,
          }) satisfies typeof networkErrorSchema.Type,
        try: () => response.json(),
      }),
    )

    const content = yield* _(
      Schema.decodeUnknown(skillContentSchema)(json).pipe(
        Effect.mapError((error) => ({
          code: "ValidationError" as const,
        })),
      ),
    )

    return { content }
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
        } satisfies typeof unknownErrorSchema.Type
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
