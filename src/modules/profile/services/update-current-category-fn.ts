import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type { updateCurrentCategoryErrorsSchema } from "@/modules/shared/api/profile/update-current-category"
import type { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { updateCurrentCategoryFactory } from "@/modules/shared/api/profile/update-current-category"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type UpdateCurrentCategoryErrors =
  | { code: "Unauthorized" }
  | typeof unknownErrorSchema.Type
  | typeof updateCurrentCategoryErrorsSchema.Type

export type UpdateCurrentCategorySuccess = typeof successResponseSchema.Type

// JSON-safe wire union
export type UpdateCurrentCategoryWire =
  | { _tag: "Failure"; error: UpdateCurrentCategoryErrors }
  | { _tag: "Success"; value: UpdateCurrentCategorySuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const updateCurrentCategoryFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
      },
  )
  .handler(async (ctx): Promise<UpdateCurrentCategoryWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated =
      userExit._tag === "Success" && userExit.value.user !== null

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const updateCurrentCategory = await updateCurrentCategoryFactory()
    const exit = await Effect.runPromiseExit(updateCurrentCategory(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: UpdateCurrentCategoryWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as UpdateCurrentCategoryErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
