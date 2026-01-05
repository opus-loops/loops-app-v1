import type { EnhancedSubQuiz } from "@/modules/shared/shell/selected_content/types/enhanced-sub-quiz"
import { Effect } from "effect"
import {
  ISubQuizNavigationManager,
  SubQuizNavigationContext,
  SubQuizNavigationError,
} from "../../sub-quiz-navigation-types"
import { SubQuizStrategySelector } from "../sub-quiz-strategy-selector"

export class ChoiceQuestionNavigationManager
  implements ISubQuizNavigationManager
{
  constructor(private strategySelector: SubQuizStrategySelector) {}

  canNavigateNext(context: SubQuizNavigationContext): boolean {
    const self = this
    return Effect.runSync(
      Effect.gen(function* () {
        const strategy = yield* self.strategySelector.getStrategy(context)
        return strategy.canNavigate(context)
      }).pipe(Effect.catchAll(() => Effect.succeed(false))),
    )
  }

  canNavigatePrevious(context: SubQuizNavigationContext): boolean {
    return context.adjacentSubQuiz !== undefined
  }

  navigateNext(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    const self = this
    return Effect.gen(function* () {
      const strategy = yield* self.strategySelector.getStrategy(context)
      if (!strategy.canNavigate(context)) {
        return yield* Effect.fail({
          code: "NavigationNotAllowed" as const,
          message: "Navigation not allowed",
        })
      }
      return yield* strategy.navigate(context)
    })
  }

  navigatePrevious(
    context: SubQuizNavigationContext,
  ): Effect.Effect<EnhancedSubQuiz, SubQuizNavigationError> {
    if (!context.adjacentSubQuiz) {
      return Effect.fail({
        code: "NoPreviousSubQuiz",
        message: "No previous sub quiz found",
      })
    }
    return Effect.succeed(context.adjacentSubQuiz)
  }
}
