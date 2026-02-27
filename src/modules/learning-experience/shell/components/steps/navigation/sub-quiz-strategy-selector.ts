import { useStartChoiceQuestion } from "@/modules/shared/shell/selected_content/services/use-start-choice-question"
import { useStartSequenceOrder } from "@/modules/shared/shell/selected_content/services/use-start-sequence-order"
import { Effect } from "effect"
import {
  ISubQuizNavigationStrategy,
  SubQuizNavigationContext,
  SubQuizNavigationError,
  SubQuizNavigationStrategy,
} from "../sub-quiz-navigation-types"
import { ChoiceQuestionToChoiceQuestionStrategy } from "./strategies/choice-question-to-choice-question-strategy"
import { ChoiceQuestionToSequenceOrderStrategy } from "./strategies/choice-question-to-sequence-order-strategy"
import { SequenceOrderToChoiceQuestionStrategy } from "./strategies/sequence-order-to-choice-question-strategy"
import { SequenceOrderToSequenceOrderStrategy } from "./strategies/sequence-order-to-sequence-order-strategy"

export class SubQuizStrategySelector {
  private strategies: Map<SubQuizNavigationStrategy, ISubQuizNavigationStrategy>

  constructor(
    startChoiceQuestion: ReturnType<typeof useStartChoiceQuestion>,
    startSequenceOrder: ReturnType<typeof useStartSequenceOrder>,
  ) {
    this.strategies = new Map([])

    this.strategies.set(
      "choiceQuestions-to-choiceQuestions",
      new ChoiceQuestionToChoiceQuestionStrategy(startChoiceQuestion),
    )

    this.strategies.set(
      "choiceQuestions-to-sequenceOrders",
      new ChoiceQuestionToSequenceOrderStrategy(startSequenceOrder),
    )


    this.strategies.set(
      "sequenceOrders-to-choiceQuestions",
      new SequenceOrderToChoiceQuestionStrategy(startChoiceQuestion),
    )

    this.strategies.set(
      "sequenceOrders-to-sequenceOrders",
      new SequenceOrderToSequenceOrderStrategy(startSequenceOrder),
    )

  }

  getStrategy(
    context: SubQuizNavigationContext,
  ): Effect.Effect<ISubQuizNavigationStrategy, SubQuizNavigationError> {
    if (!context.adjacentSubQuiz)
      return Effect.fail({
        code: "NoAdjacentSubQuiz",
        message: "No adjacent sub quiz found",
      })

    const currentKey = context.currentSubQuiz.questionType
    const adjacentKey = context.adjacentSubQuiz.questionType

    const key = `${currentKey}-to-${adjacentKey}`
    const strategy = this.strategies.get(key as SubQuizNavigationStrategy)

    if (!strategy)
      return Effect.fail({
        code: "NoStrategyFound",
        message: `No strategy found for ${key}`,
      })

    return Effect.succeed(strategy)
  }
}
