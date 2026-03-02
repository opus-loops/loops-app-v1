import { Either, Schema } from "effect"

export function parseEffectSchema<T, I, R = never>(
  schema: Schema.Schema<T, I, R>,
  data: unknown,
): T {
  const result = Schema.decodeUnknownEither(
    schema as Schema.Schema<T, I, never>,
  )(data)

  if (Either.isLeft(result)) {
    const parseError = result.left

    throw new Error(
      JSON.stringify({
        code: "validation_error",
        details: parseError.message,
      }),
    )
  }

  return result.right
}
