import { Schema } from "effect"

export const invalidInputFactory = <A, I, R>(payload: Schema.Schema<A, I, R>) =>
  Schema.Struct({
    code: Schema.Literal("invalid_input"),
    payload,
  })
