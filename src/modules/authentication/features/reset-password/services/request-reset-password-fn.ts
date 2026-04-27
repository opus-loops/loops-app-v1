import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  requestResetPasswordErrorsSchema,
  requestResetPasswordSuccessSchema,
} from "@/modules/shared/api/password/request-reset"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { requestResetPasswordFactory } from "@/modules/shared/api/password/request-reset"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type RequestResetPasswordErrors =
  | typeof requestResetPasswordErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type RequestResetPasswordSuccess =
  typeof requestResetPasswordSuccessSchema.Type

export type RequestResetPasswordWire =
  | { _tag: "Failure"; error: RequestResetPasswordErrors }
  | { _tag: "Success"; value: RequestResetPasswordSuccess }

export const requestResetPasswordFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly email: string
      },
  )
  .handler(async (ctx) => {
    const requestResetPassword = await requestResetPasswordFactory()

    const exit = await Effect.runPromiseExit(
      requestResetPassword({
        email: ctx.data.email,
      }),
    )

    if (exit._tag === "Success") {
      return { _tag: "Success", value: exit.value } as RequestResetPasswordWire
    }

    const failure = handleServerFnFailure(exit.cause)

    return {
      _tag: "Failure",
      error: failure as RequestResetPasswordErrors,
    } satisfies RequestResetPasswordWire
  })
