import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  registerErrorsSchema,
  registerSuccessSchema,
} from "@/modules/shared/api/users/register"
import { registerFactory } from "@/modules/shared/api/users/register"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

// --- TYPES (pure TS) ---------------------------------------------------------
export type RegisterErrors =
  | typeof registerErrorsSchema.Type
  | typeof unknownErrorSchema.Type

// If you prefer, re-declare these types manually to avoid importing Schema types:
export type RegisterSuccess = typeof registerSuccessSchema.Type

// JSON-safe wire union
export type RegisterWire =
  | { _tag: "Failure"; error: RegisterErrors }
  | { _tag: "Success"; value: RegisterSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const registerFn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => {
    return data as {
      email: string
      fullName: string
      password: string
      phoneNumber: string
      username: string
    }
  })
  .handler(async (ctx) => {
    const register = await registerFactory()

    const exit = await Effect.runPromiseExit(
      register({
        email: ctx.data.email,
        fullName: ctx.data.fullName,
        password: ctx.data.password,
        phoneNumber: ctx.data.phoneNumber,
        username: ctx.data.username,
      }),
    )

    if (exit._tag === "Success") {
      return { _tag: "Success", value: exit.value } as RegisterWire
    }

    const failure = handleServerFnFailure(exit.cause)

    return { _tag: "Failure", error: failure }
  })
