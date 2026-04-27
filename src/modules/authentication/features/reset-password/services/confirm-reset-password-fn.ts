import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type {
  confirmResetPasswordErrorsSchema,
  confirmResetPasswordSuccessSchema,
} from "@/modules/shared/api/password/confirm-reset"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { confirmResetPasswordFactory } from "@/modules/shared/api/password/confirm-reset"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

export type ConfirmResetPasswordErrors =
  | typeof confirmResetPasswordErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type ConfirmResetPasswordSuccess =
  typeof confirmResetPasswordSuccessSchema.Type

export type ConfirmResetPasswordWire =
  | { _tag: "Failure"; error: ConfirmResetPasswordErrors }
  | { _tag: "Success"; value: ConfirmResetPasswordSuccess }

export const confirmResetPasswordFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly confirmationCode: number
        readonly confirmPassword: string
        readonly email: string
        readonly password: string
      },
  )
  .handler(async (ctx) => {
    const confirmResetPassword = await confirmResetPasswordFactory()

    const exit = await Effect.runPromiseExit(
      confirmResetPassword({
        confirmationCode: ctx.data.confirmationCode,
        confirmPassword: ctx.data.confirmPassword,
        email: ctx.data.email,
        password: ctx.data.password,
      }),
    )

    if (exit._tag === "Success") {
      return { _tag: "Success", value: exit.value } as ConfirmResetPasswordWire
    }

    const failure = handleServerFnFailure(exit.cause)

    return {
      _tag: "Failure",
      error: failure as ConfirmResetPasswordErrors,
    } satisfies ConfirmResetPasswordWire
  })
