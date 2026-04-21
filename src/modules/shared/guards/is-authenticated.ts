import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  getLoggedUserErrorsSchema,
  getLoggedUserSuccessSchema,
} from "../api/users/get-logged-user"
import type { unknownErrorSchema } from "../utils/types"

import { getLoggedUserFactory } from "../api/users/get-logged-user"
import { handleServerFnFailure } from "../utils/handle-server-fn-failure"

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
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as IsAuthenticatedErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  },
)
