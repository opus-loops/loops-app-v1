import type { ChoiceQuestion } from "@/modules/shared/domain/entities/choice-question"
import type { CompletedChoiceQuestion } from "@/modules/shared/domain/entities/completed-choice-question"
import type { CompletedSequenceOrder } from "@/modules/shared/domain/entities/completed-sequence-order"
import type { SequenceOrder } from "@/modules/shared/domain/entities/sequence-order"
import type { SubQuiz } from "@/modules/shared/domain/entities/sub-quiz"

export type EnhancedSubQuiz = SubQuiz &
  (
    | {
        questionType: "choice_question"
        completedChoiceQuestion?: CompletedChoiceQuestion | undefined
        content?: ChoiceQuestion | undefined
      }
    | {
        questionType: "sequence_order"
        completedSequenceOrder?: CompletedSequenceOrder | undefined
        content?: SequenceOrder | undefined
      }
  )
