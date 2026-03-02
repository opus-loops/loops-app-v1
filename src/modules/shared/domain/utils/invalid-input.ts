import { Schema } from "effect"

export const UseCaseErrorSchema = Schema.Struct({
  failureType: Schema.String,
  property: Schema.String,
})

export const invalidInputFactory = <A, I, R>(payload: Schema.Schema<A, I, R>) =>
  Schema.Struct({
    code: Schema.Literal("invalid_input"),
    payload: Schema.Struct({
      useCaseName: Schema.String,
      payload,
    }),
  })
