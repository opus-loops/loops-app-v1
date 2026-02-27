import type { ChoiceQuestion } from "@/modules/shared/domain/entities/choice-question"
import type { CompletedChoiceQuestion } from "@/modules/shared/domain/entities/completed-choice-question"
import type { CompletedSequenceOrder } from "@/modules/shared/domain/entities/completed-sequence-order"
import type { SequenceOrder } from "@/modules/shared/domain/entities/sequence-order"
import type { SubQuiz } from "@/modules/shared/domain/entities/sub-quiz"

export type EnhancedSubQuiz = SubQuiz &
  (
    | {
        questionType: "choiceQuestions"
        completedQuestion?: CompletedChoiceQuestion | undefined
        content?: ChoiceQuestion | undefined
        index: number
      }
    | {
        questionType: "sequenceOrders"
        completedQuestion?: CompletedSequenceOrder | undefined
        content?: SequenceOrder | undefined
        index: number
      }
  )
