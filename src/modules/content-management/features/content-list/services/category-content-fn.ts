import type { listExploreCategoryItemsErrorsSchema } from "@/modules/shared/api/explore/category/list-explore-category-items"
import { listExploreCategoryItemsFactory } from "@/modules/shared/api/explore/category/list-explore-category-items"
import type { getExploreQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import { getExploreQuizFactory } from "@/modules/shared/api/explore/quiz/get-explore-quiz"
import type { getStartedQuizErrorsSchema } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import { getStartedQuizFactory } from "@/modules/shared/api/explore/quiz/get-started-quiz"
import type { getCompletedSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-completed-skill"
import { getCompletedSkillFactory } from "@/modules/shared/api/explore/skill/get-completed-skill"
import type { getExploreSkillErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill"
import { getExploreSkillFactory } from "@/modules/shared/api/explore/skill/get-explore-skill"
import type { getExploreSkillContentErrorsSchema } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import { getExploreSkillContentFactory } from "@/modules/shared/api/explore/skill/get-explore-skill-content"
import { getLoggedUserFactory } from "@/modules/shared/api/users/get-logged-user"
import type { CategoryContentItem } from "@/modules/shared/domain/entities/category-content-item"
import type { SkillContent } from "@/modules/shared/domain/entities/skill-content"
import type { unknownErrorSchema } from "@/modules/shared/utils/types"
import { createServerFn } from "@tanstack/react-start"
import { Cause, Effect, Option } from "effect"

// --- TYPES (pure TS) ---------------------------------------------------------
export type CategoryContentErrors =
  | typeof unknownErrorSchema.Type
  | typeof listExploreCategoryItemsErrorsSchema.Type
  | typeof getExploreSkillErrorsSchema.Type
  | typeof getExploreQuizErrorsSchema.Type
  | typeof getCompletedSkillErrorsSchema.Type
  | typeof getStartedQuizErrorsSchema.Type
  | typeof getExploreSkillContentErrorsSchema.Type
  | { code: "Unauthorized" }

export type CategoryContentSuccess = {
  categoryItems: Array<CategoryContentItem>
}

export type CategoryContentParams = {
  categoryId: string
  offset?: number
  size?: number
}

// JSON-safe wire union
export type CategoryContentWire =
  | { _tag: "Failure"; error: CategoryContentErrors }
  | { _tag: "Success"; value: CategoryContentSuccess }

// --- MAIN LOGIC AS EFFECT ----------------------------------------------------
const fetchCategoryContentEffect = (params: CategoryContentParams) =>
  Effect.gen(function* (_) {
    const { categoryId, offset, size } = params

    // 1) First, fetch all category items
    const listExploreCategoryItems = yield* _(
      Effect.promise(() => listExploreCategoryItemsFactory()),
    )

    const categoryItemsExit = yield* _(
      Effect.promise(() =>
        Effect.runPromiseExit(
          listExploreCategoryItems({
            args: { categoryId },
            queryParams: { offset, size },
          }),
        ),
      ),
    )

    if (categoryItemsExit._tag === "Failure") {
      const failure = Option.getOrElse(
        Cause.failureOption(categoryItemsExit.cause),
        () => ({
          code: "UnknownError" as const,
          message: "Failed to fetch category items",
        }),
      )
      return yield* Effect.fail(failure)
    }

    const { categoryItems } = categoryItemsExit.value

    // 2) For each category item, fetch the associated content (skill or quiz) and optional status
    const categoryContentItems: Array<CategoryContentItem> = []

    for (const categoryItem of categoryItems) {
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

        if (skillExit._tag === "Success") {
          // Try to fetch completed skill status (optional)
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

          const completedSkill =
            completedSkillExit._tag === "Success"
              ? completedSkillExit.value.completedSkill
              : undefined

          // Fetch skill content if completedSkill exists
          let skillContent: SkillContent | undefined = undefined
          if (completedSkill) {
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

            if (skillContentExit._tag === "Success") {
              skillContent = skillContentExit.value.skillContent
            }
          }

          categoryContentItems.push({
            ...categoryItem,
            content: skillExit.value.skill,
            contentType: "skills" as const,
            itemProgress: completedSkill,
            skillContent,
          } as CategoryContentItem)
        }
      } else if (categoryItem.itemType === "quizzes") {
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

          const startedQuiz =
            startedQuizExit._tag === "Success"
              ? startedQuizExit.value.startedQuiz
              : undefined

          categoryContentItems.push({
            ...categoryItem,
            content: quizExit.value.quiz,
            contentType: "quizzes" as const,
            itemProgress: startedQuiz,
          } as CategoryContentItem)
        }
      }
    }

    return { categoryItems: categoryContentItems }
  })

// --- SERVER FUNCTION ---------------------------------------------------------
export const categoryContentFn = createServerFn({
  method: "GET",
})
  .inputValidator(
    (data) =>
      data as {
        readonly categoryId: string
        readonly offset?: number
        readonly size?: number
      },
  )
  .handler(async (ctx): Promise<CategoryContentWire> => {
    const getLoggedUser = await getLoggedUserFactory()
    const userExit = await Effect.runPromiseExit(getLoggedUser())
    const isAuthenticated = userExit._tag === "Success"

    if (!isAuthenticated)
      return {
        _tag: "Failure",
        error: { code: "Unauthorized" as const },
      }

    // 1) Run your Effect on the server
    const exit = await Effect.runPromiseExit(
      fetchCategoryContentEffect(ctx.data),
    )

    // 2) Map Exit -> plain JSON union (no Schema/Exit/Cause on the wire)
    let wire: CategoryContentWire
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
              "Unexpected error occurred while fetching category content",
          }
        },
      )
      wire = { _tag: "Failure", error: failure }
    }

    // 3) Return JSON-serializable value (Start will serialize it)
    return wire
  })
