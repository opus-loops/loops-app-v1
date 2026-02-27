import { completedChoiceQuestionSchema } from "@/modules/shared/domain/entities/completed-choice-question"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { notQuizQuestionErrorSchema } from "@/modules/shared/domain/errors/not-quiz-question"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { subQuizNotFoundErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-found"
import { subQuizNotStartedErrorSchema } from "@/modules/shared/domain/errors/sub-quiz-not-started"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const getCompletedChoiceQuestionArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type GetCompletedChoiceQuestionArgs =
  typeof getCompletedChoiceQuestionArgsSchema.Type

export const getCompletedChoiceQuestionErrorsSchema = Schema.Union(
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
  subQuizNotStartedErrorSchema,
  subQuizNotFoundErrorSchema,
  notQuizQuestionErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type GetCompletedChoiceQuestionErrors =
  typeof getCompletedChoiceQuestionErrorsSchema.Type

export const getCompletedChoiceQuestionSuccessSchema = Schema.Struct({
  completedChoiceQuestion: completedChoiceQuestionSchema,
})

export type GetCompletedChoiceQuestionSuccess =
  typeof getCompletedChoiceQuestionSuccessSchema.Type

type GetCompletedChoiceQuestionResult = Effect.Effect<
  GetCompletedChoiceQuestionSuccess,
  GetCompletedChoiceQuestionErrors
>

export const getCompletedChoiceQuestionExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getCompletedChoiceQuestionErrorsSchema,
  success: getCompletedChoiceQuestionSuccessSchema,
})

export type GetCompletedChoiceQuestionExit =
  typeof getCompletedChoiceQuestionExitSchema.Type

export const getCompletedChoiceQuestionFactory = async () => {
  const instance = await instanceFactory()

  return function getCompletedChoiceQuestion(
    args: GetCompletedChoiceQuestionArgs,
  ): GetCompletedChoiceQuestionResult {
    const parsedArgs = parseEffectSchema(
      getCompletedChoiceQuestionArgsSchema,
      args,
    )
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/choice_questions/${parsedArgs.questionId}/completed`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetCompletedChoiceQuestionErrors",
        schema: getCompletedChoiceQuestionErrorsSchema,
      },
      name: "GetCompletedChoiceQuestion",
      success: {
        name: "GetCompletedChoiceQuestionSuccess",
        schema: getCompletedChoiceQuestionSuccessSchema,
      },
    })(response)
  }
}
