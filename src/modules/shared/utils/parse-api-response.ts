import type { AxiosResponse } from "axios"
import { isAxiosError } from "axios"
import type { Schema } from "effect"
import { Effect } from "effect"

import { parseEffectSchema } from "./parse-effect-schema"

type ParseApiResponseArgs<T, U, TI, TR, UI, UR> = {
  error: { name: string; schema: Schema.Schema<T, TI, TR> }
  name: string
  success: { name: string; schema: Schema.Schema<U, UI, UR> }
}

export function parseApiResponse<T, U, TI, TR, UI, UR>(
  args: ParseApiResponseArgs<T, U, TI, TR, UI, UR>,
): (response: Promise<AxiosResponse>) => Effect.Effect<U, T> {
  return (response) => {
    return Effect.tryPromise({
      catch: (e) => {
        if (isAxiosError(e) && e.response)
          return parseEffectSchema(args.error.schema, e.response.data)
        throw new Error(`Unable to parse ${args.name} schema`)
      },
      try: () =>
        response.then(({ data }) => {
          return parseEffectSchema(args.success.schema, data)
        }),
    })
  }
}
