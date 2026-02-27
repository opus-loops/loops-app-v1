import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"
import type {
  getLoggedUserErrorsSchema,
  getLoggedUserSuccessSchema,
} from "../api/users/get-logged-user"
import { getLoggedUserFactory } from "../api/users/get-logged-user"
import type { unknownErrorSchema } from "../utils/types"

// --- TYPES (pure TS) ---------------------------------------------------------
export type IsAuthenticatedErrors =
  | typeof getLoggedUserErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type IsAuthenticatedSuccess = typeof getLoggedUserSuccessSchema.Type

// JSON-safe wire union
export type IsAuthenticatedWire =
  | { _tag: "Failure"; error: IsAuthenticatedErrors }
  | { _tag: "Success"; value: IsAuthenticatedSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const isAuthenticated = createServerFn({ method: "GET" }).handler(
  async (): Promise<IsAuthenticatedWire> => {
    // 1) Run your Effect on the server
    const getLoggedUser = await getLoggedUserFactory()
    const exit = await Effect.runPromiseExit(getLoggedUser())

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: IsAuthenticatedWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  },
)
