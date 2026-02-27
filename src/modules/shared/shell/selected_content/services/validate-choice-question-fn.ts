import type {
  validateChoiceQuestionArgsSchema,
  validateChoiceQuestionErrorsSchema,
  validateChoiceQuestionSuccessSchema,
} from "@/modules/shared/api/explore/choice_question/validate-choice-question"
import { validateChoiceQuestionFactory } from "@/modules/shared/api/explore/choice_question/validate-choice-question"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type ValidateChoiceQuestionErrors =
  | typeof validateChoiceQuestionErrorsSchema.Type
  | typeof unknownErrorSchema.Type
  | { code: "Unauthorized" }

export type ValidateChoiceQuestionSuccess =
  typeof validateChoiceQuestionSuccessSchema.Type

export type ValidateChoiceQuestionArgs =
  typeof validateChoiceQuestionArgsSchema.Type

// JSON-safe wire union
export type ValidateChoiceQuestionWire =
  | { _tag: "Failure"; error: ValidateChoiceQuestionErrors }
  | { _tag: "Success"; value: ValidateChoiceQuestionSuccess }

// --- SERVER FUNCTION ---------------------------------------------------------
export const validateChoiceQuestionFn = createServerFn({
  method: "POST",
})
  .inputValidator((data) => data as ValidateChoiceQuestionArgs)
  .handler(async (ctx): Promise<ValidateChoiceQuestionWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const validateChoiceQuestion = await validateChoiceQuestionFactory()
    const exit = await Effect.runPromiseExit(validateChoiceQuestion(ctx.data))

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: ValidateChoiceQuestionWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(
        Cause.failureOption(exit.cause), //
        () => {
          // Fallback if you sometimes throw defects: map to a typed error variant in your union
          return {
            code: "UnknownError" as const,
            message:
              "Unexpected error occurred while validating choice question",
          }
        },
      )
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
