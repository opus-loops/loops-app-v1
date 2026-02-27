import { choiceQuestionSchema } from "@/modules/shared/domain/entities/choice-question"
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

const getExploreChoiceQuestionArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
  questionId: Schema.String,
})

type GetExploreChoiceQuestionArgs =
  typeof getExploreChoiceQuestionArgsSchema.Type

export const getExploreChoiceQuestionErrorsSchema = Schema.Union(
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

export type GetExploreChoiceQuestionErrors =
  typeof getExploreChoiceQuestionErrorsSchema.Type

export const getExploreChoiceQuestionSuccessSchema = Schema.Struct({
  choiceQuestion: choiceQuestionSchema,
})

export type GetExploreChoiceQuestionSuccess =
  typeof getExploreChoiceQuestionSuccessSchema.Type

type GetExploreChoiceQuestionResult = Effect.Effect<
  GetExploreChoiceQuestionSuccess,
  GetExploreChoiceQuestionErrors
>

export const getExploreChoiceQuestionExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: getExploreChoiceQuestionErrorsSchema,
  success: getExploreChoiceQuestionSuccessSchema,
})

export const getExploreChoiceQuestionFactory = async () => {
  const instance = await instanceFactory()

  return function getExploreChoiceQuestion(
    args: GetExploreChoiceQuestionArgs,
  ): GetExploreChoiceQuestionResult {
    const parsedArgs = parseEffectSchema(
      getExploreChoiceQuestionArgsSchema,
      args,
    )
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/choice_questions/${parsedArgs.questionId}`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "GetExploreChoiceQuestionErrors",
        schema: getExploreChoiceQuestionErrorsSchema,
      },
      name: "GetExploreChoiceQuestion",
      success: {
        name: "GetExploreChoiceQuestionSuccess",
        schema: getExploreChoiceQuestionSuccessSchema,
      },
    })(response)
  }
}
