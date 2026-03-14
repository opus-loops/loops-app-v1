import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  startCategoryErrorsSchema,
  startCategorySuccessSchema,
} from "@/modules/shared/api/explore/started_category/start-category"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { startCategoryFactory } from "@/modules/shared/api/explore/started_category/start-category"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartCategoryErrors =
  | { code: "Unauthorized" }
  | typeof startCategoryErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartCategorySuccess = typeof startCategorySuccessSchema.Type

// JSON-safe wire union
export type StartCategoryWire =
  | { _tag: "Failure"; error: StartCategoryErrors }
  | { _tag: "Success"; value: StartCategorySuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startCategoryFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
      },
  )
  .handler(async (ctx): Promise<StartCategoryWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const startCategory = await startCategoryFactory()
    const exit = await Effect.runPromiseExit(startCategory(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartCategoryWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as StartCategoryErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
