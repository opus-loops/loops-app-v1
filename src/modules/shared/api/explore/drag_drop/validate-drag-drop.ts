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
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instance } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

export const validateDragDropArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
  spentTime: Schema.optional(Schema.Number),
  userAnswer: Schema.optional(Schema.String),
})

type ValidateDragDropArgs = typeof validateDragDropArgsSchema.Type

export const validateDragDropErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
      questionId: Schema.optional(Schema.String),
      spentTime: Schema.optional(Schema.String),
      userAnswer: Schema.optional(Schema.String),
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

export type ValidateDragDropErrors = typeof validateDragDropErrorsSchema.Type

export const validateDragDropSuccessSchema = Schema.Struct({
  isCorrect: Schema.Boolean,
  userAnswer: Schema.optional(Schema.String),
  expectedResponse: Schema.Array(Schema.Number),
  spentTime: Schema.Number,
  estimatedTime: Schema.Number,
})

export type ValidateDragDropSuccess = typeof validateDragDropSuccessSchema.Type

type ValidateDragDropResult = Effect.Effect<
  ValidateDragDropSuccess,
  ValidateDragDropErrors
>

export const validateDragDropExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: validateDragDropErrorsSchema,
  success: validateDragDropSuccessSchema,
})

export type ValidateDragDropExit = typeof validateDragDropExitSchema.Type

export const validateDragDrop = (
  args: ValidateDragDropArgs,
): ValidateDragDropResult => {
  const parsedArgs = parseEffectSchema(validateDragDropArgsSchema, args)
  const { categoryId, quizId, questionId, ...body } = parsedArgs

  const url = `/explore/categories/${categoryId}/quizzes/${quizId}/drag_drops/${questionId}/completed`
  const response = instance.post(url, body)

  return parseApiResponse({
    error: {
      name: "ValidateDragDropErrors",
      schema: validateDragDropErrorsSchema,
    },
    name: "ValidateDragDrop",
    success: {
      name: "ValidateDragDropSuccess",
      schema: validateDragDropSuccessSchema,
    },
  })(response)
}
