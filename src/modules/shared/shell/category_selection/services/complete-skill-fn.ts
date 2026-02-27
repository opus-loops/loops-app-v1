import type {
  completeSkillErrorsSchema,
  completeSkillSuccessSchema,
} from "@/modules/shared/api/explore/skill/complete-skill"
import { completeSkillFactory } from "@/modules/shared/api/explore/skill/complete-skill"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type CompleteSkillErrors =
  | typeof completeSkillErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

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
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        // Make sure your completeSkillErrorsSchema includes an UnknownError or similar branch.
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    return wire
  })
