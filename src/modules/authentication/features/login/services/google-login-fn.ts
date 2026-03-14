import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  googleLoginErrorsSchema,
  googleLoginSuccessSchema,
} from "@/modules/shared/api/auth/google-login"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { googleLoginFactory } from "@/modules/shared/api/auth/google-login"
import { createSession } from "@/modules/shared/shell/session/session"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type GoogleLoginErrors =
  | typeof googleLoginErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type GoogleLoginSuccess = typeof googleLoginSuccessSchema.Type

// JSON-safe wire union
export type GoogleLoginWire =
  | { _tag: "Failure"; error: GoogleLoginErrors }
  | { _tag: "Success"; value: GoogleLoginSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const googleLoginFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly accessToken: string
      },
  )
  .handler(async (ctx) => {
    // 1) Run your Effect on the server
    const googleLogin = await googleLoginFactory()

    const exit = await Effect.runPromiseExit(
      googleLogin({
        accessToken: ctx.data.accessToken,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: GoogleLoginWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
      // 3) Server-side side-effects
      await createSession({
        accessToken: exit.value.access.token,
        refreshToken: exit.value.refresh.token,
      })
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as GoogleLoginErrors }
    }

    // 4) Return JSON-serializable value (Start will serialize it)
    return wire
  })
