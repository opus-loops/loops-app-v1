import { subQuizSchema } from "@/modules/shared/domain/entities/sub-quiz"
import { categoryNotFoundErrorSchema } from "@/modules/shared/domain/errors/category-not-found"
import { categoryNotStartedErrorSchema } from "@/modules/shared/domain/errors/category-not-started"
import { invalidExpiredTokenErrorSchema } from "@/modules/shared/domain/errors/invalid-expired-token"
import { notCategoryItemErrorSchema } from "@/modules/shared/domain/errors/not-category-item"
import { quizNotFoundErrorSchema } from "@/modules/shared/domain/errors/quiz-not-found"
import { quizNotStartedErrorSchema } from "@/modules/shared/domain/errors/quiz-not-started"
import { userNotFoundErrorSchema } from "@/modules/shared/domain/errors/user-not-found"
import { invalidInputFactory } from "@/modules/shared/domain/utils/invalid-input"
import { instanceFactory } from "@/modules/shared/utils/axios"
import { parseApiResponse } from "@/modules/shared/utils/parse-api-response"
import { parseEffectSchema } from "@/modules/shared/utils/parse-effect-schema"
import type { Effect } from "effect"
import { Schema } from "effect"

const listExploreSubQuizzesArgsSchema = Schema.Struct({
  categoryId: Schema.String,
  quizId: Schema.String,
})

type ListExploreSubQuizzesArgs = typeof listExploreSubQuizzesArgsSchema.Type

export const listExploreSubQuizzesErrorsSchema = Schema.Union(
  invalidInputFactory(
    Schema.Struct({
      authorization: Schema.optional(Schema.String),
      userId: Schema.optional(Schema.String),
      categoryId: Schema.optional(Schema.String),
      quizId: Schema.optional(Schema.String),
    }),
  ),
  categoryNotFoundErrorSchema,
  categoryNotStartedErrorSchema,
  quizNotStartedErrorSchema,
  quizNotFoundErrorSchema,
  notCategoryItemErrorSchema,
  invalidExpiredTokenErrorSchema,
  userNotFoundErrorSchema,
)

export type ListExploreSubQuizzesErrors =
  typeof listExploreSubQuizzesErrorsSchema.Type

export const listExploreSubQuizzesSuccessSchema = Schema.Struct({
  subQuizzes: Schema.Array(subQuizSchema),
})

export type ListExploreSubQuizzesSuccess =
  typeof listExploreSubQuizzesSuccessSchema.Type

type ListExploreSubQuizzesResult = Effect.Effect<
  ListExploreSubQuizzesSuccess,
  ListExploreSubQuizzesErrors
>

export const listExploreSubQuizzesExitSchema = Schema.Exit({
  defect: Schema.String,
  failure: listExploreSubQuizzesErrorsSchema,
  success: listExploreSubQuizzesSuccessSchema,
})

export const listExploreSubQuizzesFactory = async () => {
  const instance = await instanceFactory()

  return function listExploreSubQuizzes(
    args: ListExploreSubQuizzesArgs,
  ): ListExploreSubQuizzesResult {
    const parsedArgs = parseEffectSchema(listExploreSubQuizzesArgsSchema, args)
    const url = `/explore/categories/${parsedArgs.categoryId}/quizzes/${parsedArgs.quizId}/sub_quizzes`
    const response = instance.get(url)

    return parseApiResponse({
      error: {
        name: "ListExploreSubQuizzesErrors",
        schema: listExploreSubQuizzesErrorsSchema,
      },
      name: "ListExploreSubQuizzes",
      success: {
        name: "ListExploreSubQuizzesSuccess",
        schema: listExploreSubQuizzesSuccessSchema,
      },
    })(response)
  }
}
