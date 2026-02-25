import type {
  loginErrorsSchema,
  loginSuccessSchema,
} from "@/modules/shared/api/auth/login"
import { login } from "@/modules/shared/api/auth/login"
import { createSession } from "@/modules/shared/shell/session"
import { interceptRequests } from "@/modules/shared/utils/axios"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type LoginErrors =
  | typeof loginErrorsSchema.Type
  | typeof unknownErrorSchema.Type
// If you prefer, re-declare these types manually to avoid importing Schema types:
export type LoginSuccess = typeof loginSuccessSchema.Type

// JSON-safe wire union
export type LoginWire =
  | { _tag: "Failure"; error: LoginErrors }
  | { _tag: "Success"; value: LoginSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const loginFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly password: string
        readonly username: string
      },
  )
  .handler(async (ctx) => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      login({
        password: ctx.data.password,
        username: ctx.data.username,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: LoginWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
      // 3) Server-side side-effects
      interceptRequests(exit.value.access.token)
      await createSession({
        accessToken: exit.value.access.token,
        refreshToken: exit.value.refresh.token,
      })
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        // Make sure your loginErrorsSchema includes an UnknownError or similar branch.
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 4) Return JSON-serializable value (Start will serialize it)
    return wire
  })
