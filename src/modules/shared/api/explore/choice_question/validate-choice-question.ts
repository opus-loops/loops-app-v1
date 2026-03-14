import type { Effect } from "effect"

import { Schema } from "effect"

import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { internalErrorSchema } from "@/modules/shared/domain/errors/internal-error"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { notQuizQuestionErrorSchema } from "@/modules/shared/domain/errors/not-quiz-question"
import { questionAlreadyCompletedErrorSchema } from "@/modules/shared/domain/errors/question-already-completed"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { subQuizNotFoundErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-found"
import { subQuizNotStartedErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-started"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import {
  invalidInputFactory,
  UseCaseErrorSchema,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"

export const validateChoiceQuestionArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  questionId: Schema.String,
  quizId: Schema.String,
  spentTime: Schema.optional(Schema.Number),
  userAnswer: Schema.optional(Schema.Array(Schema.Number)),
})

type ValidateChoiceQuestionArgs = typeof validateChoiceQuestionArgsSchema.Type

export const validateChoiceQuestionErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      categoryId: Schema.optional(UseCaseErrorSchema),
      questionId: Schema.optional(UseCaseErrorSchema),
      quizId: Schema.optional(UseCaseErrorSchema),
      spentTime: Schema.optional(UseCaseErrorSchema),
      userAnswer: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  quizNotStartedErrorSchema,
  subQuizNotStartedErrorSchema,
  subQuizNotFoundErrorSchema,
  notQuizQuestionErrorSchema,
  questionAlreadyCompletedErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
  internalErrorSchema,
)

export type ValidateChoiceQuestionErrors =
  typeof validateChoiceQuestionErrorsSchema.Type

export const validateChoiceQuestionSuccessSchema = Schema.Struct({
  questionValidation: Schema.Struct({
    estimatedTime: Schema.Number,
    expectedResponse: Schema.Array(Schema.Number),
    isCorrect: Schema.Boolean,
    spentTime: Schema.Number,
    userAnswer: Schema.optional(Schema.Array(Schema.Number)),
  }),
})

export type ValidateChoiceQuestionSuccess =
  typeof validateChoiceQuestionSuccessSchema.Type

type ValidateChoiceQuestionResult = Effect.Effect<
  ValidateChoiceQuestionSuccess,
  ValidateChoiceQuestionErrors
>

export const validateChoiceQuestionExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: validateChoiceQuestionErrorsSchema,
  success: validateChoiceQuestionSuccessSchema,
})

export type ValidateChoiceQuestionExit =
  typeof validateChoiceQuestionExitSchema.Type

export const validateChoiceQuestionFactory = async () => {
  const instance = await instanceFactory()

  return function validateChoiceQuestion(
    args: ValidateChoiceQuestionArgs,
  ): ValidateChoiceQuestionResult {
    const parsedArgs = parseEffectSchema(validateChoiceQuestionArgsSchema, args)
    const { categoryId, questionId, quizId, ...body } = parsedArgs

    const url = `/explore/categories/${categoryId}/quizzes/${quizId}/choice_questions/${questionId}/completed`
    const response = instance.patch(url, body)

    return parseApiResponse({
      error: {
        name: "ValidateChoiceQuestionErrors",
        schema: validateChoiceQuestionErrorsSchema,
      },
      name: "ValidateChoiceQuestion",
      success: {
        name: "ValidateChoiceQuestionSuccess",
        schema: validateChoiceQuestionSuccessSchema,
      },
    })(response)
  }
}
