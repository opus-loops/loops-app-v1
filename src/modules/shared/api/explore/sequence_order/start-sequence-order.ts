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
import { successResponseSchema } from "@/modules/shared/domain/types/success-response"
import {
  UseCaseErrorSchema,
  invalidInputFactory,
} from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const startSequenceOrderArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type StartSequenceOrderArgs = typeof startSequenceOrderArgsSchema.Type

export const startSequenceOrderErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(UseCaseErrorSchema),
      userId: Schema.optional(UseCaseErrorSchema),
      categoryId: Schema.optional(UseCaseErrorSchema),
      quizId: Schema.optional(UseCaseErrorSchema),
      questionId: Schema.optional(UseCaseErrorSchema),
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

export type StartSequenceOrderErrors =
  typeof startSequenceOrderErrorsSchema.Type

export const startSequenceOrderSuccessSchema = successResponseSchema

export type StartSequenceOrderSuccess =
  typeof startSequenceOrderSuccessSchema.Type

type StartSequenceOrderResult = Effect.Effect<
  StartSequenceOrderSuccess,
  StartSequenceOrderErrors
>

export const startSequenceOrderExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: startSequenceOrderErrorsSchema,
  success: startSequenceOrderSuccessSchema,
})

export type StartSequenceOrderExit = typeof startSequenceOrderExitSchema.Type

export const startSequenceOrderFactory = async () => {
  const instance = await instanceFactory()

  return function startSequenceOrder(
    args: StartSequenceOrderArgs,
  ): StartSequenceOrderResult {
    const parsedArgs = parseEffectSchema(startSequenceOrderArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/sequence_orders/${parsedArgs.questionId}/completed`
    const response = instance.post(url)

    return parseApiResponse({
      error: {
        name: "StartSequenceOrderErrors",
        schema: startSequenceOrderErrorsSchema,
      },
      name: "StartSequenceOrder",
      success: {
        name: "StartSequenceOrderSuccess",
        schema: startSequenceOrderSuccessSchema,
      },
    })(response)
  }
}
