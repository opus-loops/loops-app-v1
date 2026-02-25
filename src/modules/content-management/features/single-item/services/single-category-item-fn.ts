import type { getExploreCategoryItemErrorsSchema } from "@/modules/shared/api/explore/category/get-explore-category-item"
import { getExploreCategoryItem } from "@/modules/shared/api/explore/category/get-explore-category-item"
import type { getExploreQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import { getExploreQuiz } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import type { getStartedQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import { getStartedQuiz } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import type { getCompletedSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-completed-skill"
import { getCompletedSkill } from "@/modules/shared/api/explore/skill/get-completed-skill"
import type { getExploreSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill"
import { getExploreSkill } from "@/modules/shared/api/explore/skill/get-explore-skill"
import type { getExploreSkillContentErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import { getExploreSkillContent } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type SingleCategoryItemErrors =
  | typeof unknownErrorSchema.Type
  | typeof getExploreCategoryItemErrorsSchema.Type
  | typeof getExploreSkillErrorsSchema.Type
  | typeof getExploreQuizErrorsSchema.Type
  | typeof getCompletedSkillErrorsSchema.Type
  | typeof getStartedQuizErrorsSchema.Type
  | typeof getExploreSkillContentErrorsSchema.Type

export type SingleCategoryItemSuccess = {
  categoryItem: CategoryContentItem
}

export type SingleCategoryItemParams = {
  categoryId: string
  itemId: string
}

export type SingleCategoryItemWire =
  | { _tag: "Failure"; error: SingleCategoryItemErrors }
  | { _tag: "Success"; value: SingleCategoryItemSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchSingleCategoryItemEffect = (params: SingleCategoryItemParams) =>
  Effect.gen(function* () {
    const { categoryId, itemId } = params

    // 1) First, fetch the category item
    const categoryItemExit = yield* Effect.promise(() =>
      Effect.runPromiseExit(getExploreCategoryItem({ categoryId, itemId })),
    )

    if (categoryItemExit._tag === "Failure") {
      const failure = Option.getOrElse(
        Cause.failureOption(categoryItemExit.cause),
        () => ({
          code: "UnknownError" as const,
          message: "Failed to fetch category item",
        }),
      )
      return yield* Effect.fail(failure)
    }

    const categoryItem = categoryItemExit.value.categoryItem

    // 2) Fetch the associated content (skill or quiz) and optional status
    if (categoryItem.itemType === "skills") {
      const skillExit = yield* Effect.promise(() =>
        Effect.runPromiseExit(
          getExploreSkill({
            categoryId,
            skillId: categoryItem.itemId,
          }),
        ),
      )

      if (skillExit._tag === "Success") {
        // Try to fetch completed skill status (optional)
        const completedSkillExit = yield* Effect.promise(() =>
          Effect.runPromiseExit(
            getCompletedSkill({
              categoryId,
              skillId: categoryItem.itemId,
            }),
          ),
        )

        const completedSkill =
          completedSkillExit._tag === "Success"
            ? completedSkillExit.value.completedSkill
            : undefined

        // Try to fetch skill content if skill is completed (optional)
        let skillContent = undefined
        if (completedSkill) {
          const skillContentExit = yield* Effect.promise(() =>
            Effect.runPromiseExit(
              getExploreSkillContent({
                categoryId,
                skillId: categoryItem.itemId,
              }),
            ),
          )

          skillContent =
            skillContentExit._tag === "Success"
              ? skillContentExit.value.skillContent
              : undefined
        }

        const skillCategoryItem: CategoryContentItem = {
          categoryItemId: categoryItem.categoryItemId,
          categoryId: categoryItem.categoryId,
          itemId: categoryItem.itemId,
          itemType: "skills" as const,
          previousCategoryItem: categoryItem.previousCategoryItem,
          nextCategoryItem: categoryItem.nextCategoryItem,
          content: skillExit.value.skill,
          contentType: "skills" as const,
        }

        if (completedSkill) skillCategoryItem["completedSkill"] = completedSkill
        if (skillContent) skillCategoryItem["skillContent"] = skillContent

        return { categoryItem: skillCategoryItem }
      }
    } else if (categoryItem.itemType === "quizzes") {
      const quizExit = yield* Effect.promise(() =>
        Effect.runPromiseExit(
          getExploreQuiz({
            categoryId,
            quizId: categoryItem.itemId,
          }),
        ),
      )

      if (quizExit._tag === "Success") {
        // Try to fetch started quiz status (optional)
        const startedQuizExit = yield* Effect.promise(() =>
          Effect.runPromiseExit(
            getStartedQuiz({
              categoryId,
              quizId: categoryItem.itemId,
            }),
          ),
        )

        const startedQuiz =
          startedQuizExit._tag === "Success"
            ? startedQuizExit.value.startedQuiz
            : undefined

        const quizCategoryItem: CategoryContentItem = {
          categoryItemId: categoryItem.categoryItemId,
          categoryId: categoryItem.categoryId,
          itemId: categoryItem.itemId,
          itemType: "quizzes" as const,
          previousCategoryItem: categoryItem.previousCategoryItem,
          nextCategoryItem: categoryItem.nextCategoryItem,
          content: quizExit.value.quiz,
          contentType: "quizzes" as const,
        }

        if (startedQuiz) quizCategoryItem["startedQuiz"] = startedQuiz

        return { categoryItem: quizCategoryItem }
      }
    }

    // If we reach here, something went wrong with fetching content
    return yield* Effect.fail({
      code: "UnknownError" as const,
      message: "Failed to fetch category item content",
    })
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const singleCategoryItemFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly itemId: string
      },
  )
  .handler(async (ctx): Promise<SingleCategoryItemWire> => {
    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchSingleCategoryItemEffect(ctx.data),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: SingleCategoryItemWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = Option.getOrElse(Cause.failureOption(exit.cause), () => {
        // Fallback if you sometimes throw defects: map to a typed error variant in your union
        return {
          code: "UnknownError" as const,
          message:
            "Unexpected error occurred while fetching single category item",
        }
      })
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
