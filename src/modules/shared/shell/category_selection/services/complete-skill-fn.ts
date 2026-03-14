import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

import type {
  completeSkillErrorsSchema,
  completeSkillSuccessSchema,
} from "@/modules/shared/api/explore/skill/complete-skill"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { completeSkillFactory } from "@/modules/shared/api/explore/skill/complete-skill"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type CompleteSkillErrors =
  | { code: "Unauthorized" }
  | typeof completeSkillErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type CompleteSkillSuccess = typeof completeSkillSuccessSchema.Type

// JSON-safe wire union
export type CompleteSkillWire =
  | { _tag: "Failure"; error: CompleteSkillErrors }
  | { _tag: "Success"; value: CompleteSkillSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const completeSkillFn = createServerFn({
  method: "POST",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly skillId: string
      },
  )
  .handler(async (ctx): Promise<CompleteSkillWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const completeSkill = await completeSkillFactory()
    const exit = await Effect.runPromiseExit(
      completeSkill({
        categoryId: ctx.data.categoryId,
        skillId: ctx.data.skillId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: CompleteSkillWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as CompleteSkillErrors }
    }

    return wire
  })
