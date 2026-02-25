import type {
  startSkillErrorsSchema,
  startSkillSuccessSchema,
} from "@/modules/shared/api/explore/skill/start-skill"
import { startSkill } from "@/modules/shared/api/explore/skill/start-skill"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type StartSkillErrors =
  | typeof startSkillErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type StartSkillSuccess = typeof startSkillSuccessSchema.Type

// JSON-safe wire union
export type StartSkillWire =
  | { _tag: "Failure"; error: StartSkillErrors }
  | { _tag: "Success"; value: StartSkillSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const startSkillFn = createServerFn({ method: "POST" })
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly skillId: string
      },
  )
  .handler(async (ctx): Promise<StartSkillWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      startSkill({
        categoryId: ctx.data.categoryId,
        skillId: ctx.data.skillId,
      }),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: StartSkillWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message: "Unexpected error",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
