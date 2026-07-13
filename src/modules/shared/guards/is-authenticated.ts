import { createServerFn } from "@tanstack/react-start"
import { Effect, Either, Schema } from "effect"
import { decodeJwt } from "jose"

import type {
  getLoggedUserErrorsSchema,
  getLoggedUserSuccessSchema,
} from "../api/users/get-logged-user"
import type { unknownErrorSchema } from "../utils/types"

import { getLoggedUserFactory } from "../api/users/get-logged-user"
import { accessTokenPayloadSchema } from "../domain/value_objects/access-token-payload"
import { Permission } from "../domain/value_objects/permission"
import { deleteSession, getSession } from "../shell/session/session"
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

function decodeAccessTokenPayload(accessToken: string) {
  const decoded = Either.try({
    catch: () => null,
    try: () => decodeJwt(accessToken),
  })

  if (Either.isLeft(decoded)) return null
  const decoder = Schema.decodeUnknownEither(accessTokenPayloadSchema)
  const parsed = decoder(decoded.right)
  return Either.isRight(parsed) ? parsed.right : null
}

// --- SERVER FUNCTION ---------------------------------------------------------
export const isAuthenticated = createServerFn({ method: "GET" }).handler(
  async (): Promise<IsAuthenticatedWire> => {
    const session = await getSession()

    if (!session)
      return {
        _tag: "Failure",
        error: { code: "invalid_token" },
      }

    const payload = decodeAccessTokenPayload(session.accessToken)
    const hasAccessToApp = payload?.permissions.includes(Permission.AppAccess)
    console.log("payload", payload)

    if (!hasAccessToApp) {
      deleteSession()
      return {
        _tag: "Failure",
        error: {
          code: "resource_access_forbidden",
          status: 403,
        },
      }
    }

    const getLoggedUser = await getLoggedUserFactory()
    const exit = await Effect.runPromiseExit(getLoggedUser())

    let wire: IsAuthenticatedWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as IsAuthenticatedErrors }
    }

    return wire
  },
)
