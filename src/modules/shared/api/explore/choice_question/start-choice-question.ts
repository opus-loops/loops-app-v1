import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { internalErrorSchema } from "@/modules/shared/domain/errors/internal-error"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { notQuizQuestionErrorSchema } from "@/modules/shared/domain/errors/not-quiz-question"
import { previousQuestionNotCompletedErrorSchema } from "@/modules/shared/domain/errors/previous-question-not-completed"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { subQuizNotFoundErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-found"
import { subQuizStartedCompletedErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-started-completed"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { successMessageSchema } from "@/modules/shared/domain/types/success-message"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const startChoiceQuestionArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type StartChoiceQuestionArgs = typeof startChoiceQuestionArgsSchema.Type

export const startChoiceQuestionErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
      questionId: Schema.optional(Schema.String),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  quizNotStartedErrorSchema,
  subQuizNotFoundErrorSchema,
  notQuizQuestionErrorSchema,
  subQuizStartedCompletedErrorSchema,
  invalidExpiredTokenErrorSchema,
  previousQuestionNotCompletedErrorSchema,
  userNotFoundErrorSchema,
  internalErrorSchema,
)

export type StartChoiceQuestionErrors =
  typeof startChoiceQuestionErrorsSchema.Type

export const startChoiceQuestionSuccessSchema = successMessageSchema

export type StartChoiceQuestionSuccess =
  typeof startChoiceQuestionSuccessSchema.Type

type StartChoiceQuestionResult = Effect.Effect<
  StartChoiceQuestionSuccess,
  StartChoiceQuestionErrors
>

export const startChoiceQuestionExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: startChoiceQuestionErrorsSchema,
  success: startChoiceQuestionSuccessSchema,
})

export type StartChoiceQuestionExit = typeof startChoiceQuestionExitSchema.Type

export const startChoiceQuestionFactory = async () => {
  const instance = await instanceFactory()

  return function startChoiceQuestion(
    args: StartChoiceQuestionArgs,
  ): StartChoiceQuestionResult {
    const parsedArgs = parseEffectSchema(startChoiceQuestionArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/choice_questions/${parsedArgs.questionId}/completed`
    const response = instance.post(url)

    return parseApiResponse({
      error: {
        name: "StartChoiceQuestionErrors",
        schema: startChoiceQuestionErrorsSchema,
      },
      name: "StartChoiceQuestion",
      success: {
        name: "StartChoiceQuestionSuccess",
        schema: startChoiceQuestionSuccessSchema,
      },
    })(response)
  }
}
