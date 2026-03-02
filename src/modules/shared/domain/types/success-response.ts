import { Schema } from "effect"

export const successResponseSchema = Schema.Struct({
  isSuccess: Schema.Boolean,
})

export const successResponseWithPayloadSchemaFactory = <
  T extends Schema.Struct<any>,
>(
  payload: T,
) =>
  Schema.Struct({
    isSuccess: Schema.Boolean,
    payload,
  })
