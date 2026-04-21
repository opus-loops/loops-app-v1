import { createServerFn } from "@tanstack/react-start"
import { Effect } from "effect"

import type { getExploreCategoryItemErrorsSchema } from "@/modules/shared/api/explore/category/get-explore-category-item"
import type { getExploreQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import type { getStartedQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import type { getCompletedSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-completed-skill"
import type { getExploreSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill"
import type { getExploreSkillContentErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"

import { getExploreCategoryItemFactory } from "@/modules/shared/api/explore/category/get-explore-category-item"
import { getExploreQuizFactory } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import { getStartedQuizFactory } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import { getCompletedSkillFactory } from "@/modules/shared/api/explore/skill/get-completed-skill"
import { getExploreSkillFactory } from "@/modules/shared/api/explore/skill/get-explore-skill"
import { getExploreSkillContentFactory } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import { handleServerFnFailure } from "@/modules/shared/utils/handle-server-fn-failure"

// --- TYPES (pure TS) ---------------------------------------------------------
export type SingleCategoryItemErrors =
  | { code: "Unauthorized" }
  | typeof getCompletedSkillErrorsSchema.Type
  | typeof getExploreCategoryItemErrorsSchema.Type
  | typeof getExploreQuizErrorsSchema.Type
  | typeof getExploreSkillContentErrorsSchema.Type
  | typeof getExploreSkillErrorsSchema.Type
  | typeof getStartedQuizErrorsSchema.Type
  | typeof unknownErrorSchema.Type

export type SingleCategoryItemParams = {
  categoryId: string
  itemId: string
}

export type SingleCategoryItemSuccess = {
  categoryItem: CategoryContentItem | null
}

export type SingleCategoryItemWire =
  | { _tag: "Failure"; error: SingleCategoryItemErrors }
  | { _tag: "Success"; value: SingleCategoryItemSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchSingleCategoryItemEffect = (params: SingleCategoryItemParams) =>
  Effect.gen(function* (_) {
    const { categoryId, itemId } = params

    // 1) First, fetch the category item
    const getExploreCategoryItem = yield* _(
      Effect.promise(() => getExploreCategoryItemFactory()),
    )

    const categoryItemExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(getExploreCategoryItem({ categoryId, itemId })),
      ),
    )

    if (categoryItemExit._tag === "Failure") {
      const failure = handleServerFnFailure(categoryItemExit.cause)
      return yield* Effect.fail(failure as SingleCategoryItemErrors)
    }

    const categoryItem = categoryItemExit.value.categoryItem

    if (categoryItem === null) return { categoryItem: null }

    // 2) Fetch the associated content (skill or quiz) and optional status
    if (categoryItem.itemType === "skills") {
      const getExploreSkill = yield* _(
        Effect.promise(() => getExploreSkillFactory()),
      )

      const skillExit = yield* _(
        Effect.promise(() =>
          Effect.runPromiseExit(
            getExploreSkill({
              categoryId,
              skillId: categoryItem.itemId,
            }),
          ),
        ),
      )

      if (skillExit._tag === "Failure") {
        const failure = handleServerFnFailure(skillExit.cause)
        return yield* Effect.fail(failure as SingleCategoryItemErrors)
      }

      const skill = skillExit.value.skill

      if (skill === null) return { categoryItem: null }

      const getCompletedSkill = yield* _(
        Effect.promise(() => getCompletedSkillFactory()),
      )

      const completedSkillExit = yield* _(
        Effect.promise(() =>
          Effect.runPromiseExit(
            getCompletedSkill({
              categoryId,
              skillId: categoryItem.itemId,
            }),
          ),
        ),
      )

      if (completedSkillExit._tag === "Failure") {
        const failure = handleServerFnFailure(completedSkillExit.cause)
        return yield* Effect.fail(failure as SingleCategoryItemErrors)
      }

      const completedSkill = completedSkillExit.value.completedSkill

      let skillContent = null
      if (completedSkill !== null) {
        const getExploreSkillContent = yield* _(
          Effect.promise(() => getExploreSkillContentFactory()),
        )

        const skillContentExit = yield* _(
          Effect.promise(() =>
            Effect.runPromiseExit(
              getExploreSkillContent({
                categoryId,
                skillId: categoryItem.itemId,
              }),
            ),
          ),
        )

        if (skillContentExit._tag === "Failure") {
          const failure = handleServerFnFailure(skillContentExit.cause)
          return yield* Effect.fail(failure as SingleCategoryItemErrors)
        }

        skillContent = skillContentExit.value.skillContent
      }

      const skillCategoryItem: CategoryContentItem = {
        categoryId: categoryItem.categoryId,
        categoryItemId: categoryItem.categoryItemId,
        content: skill,
        contentType: "skills" as const,
        itemId: categoryItem.itemId,
        itemType: "skills" as const,
        nextCategoryItem: categoryItem.nextCategoryItem,
        previousCategoryItem: categoryItem.previousCategoryItem,
      }

      if (completedSkill !== null)
        skillCategoryItem["itemProgress"] = completedSkill
      if (skillContent !== null)
        skillCategoryItem["skillContent"] = skillContent

      return { categoryItem: skillCategoryItem }
    } else {
      const getExploreQuiz = yield* _(
        Effect.promise(() => getExploreQuizFactory()),
      )

      const quizExit = yield* _(
        Effect.promise(() =>
          Effect.runPromiseExit(
            getExploreQuiz({
              categoryId,
              quizId: categoryItem.itemId,
            }),
          ),
        ),
      )

      if (quizExit._tag === "Success") {
        const quiz = quizExit.value.quiz

        if (quiz === null) return { categoryItem: null }

        // Try to fetch started quiz status (optional)
        const getStartedQuiz = yield* _(
          Effect.promise(() => getStartedQuizFactory()),
        )

        const startedQuizExit = yield* _(
          Effect.promise(() =>
            Effect.runPromiseExit(
              getStartedQuiz({
                categoryId,
                quizId: categoryItem.itemId,
              }),
            ),
          ),
        )

        if (startedQuizExit._tag === "Failure") {
          const failure = handleServerFnFailure(startedQuizExit.cause)
          return yield* Effect.fail(failure as SingleCategoryItemErrors)
        }

        const startedQuiz = startedQuizExit.value.startedQuiz

        const quizCategoryItem: CategoryContentItem = {
          categoryId: categoryItem.categoryId,
          categoryItemId: categoryItem.categoryItemId,
          content: quiz,
          contentType: "quizzes" as const,
          itemId: categoryItem.itemId,
          itemType: "quizzes" as const,
          nextCategoryItem: categoryItem.nextCategoryItem,
          previousCategoryItem: categoryItem.previousCategoryItem,
        }

        if (startedQuiz !== null) quizCategoryItem["itemProgress"] = startedQuiz

        return { categoryItem: quizCategoryItem }
      }
    }

    // If we reach here, something went wrong with fetching content
    return yield* Effect.fail({
      code: "UnknownError" as const,
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
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated =
      userExit._tag === "Success" && userExit.value.user !== null

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchSingleCategoryItemEffect(ctx.data),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: SingleCategoryItemWire
    if (exit._tag === "Success") {
      wire = { _tag: "Success", value: exit.value }
    } else {
      const failure = handleServerFnFailure(exit.cause)
      wire = { _tag: "Failure", error: failure as SingleCategoryItemErrors }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
