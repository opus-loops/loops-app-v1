import type { CategoryItem } from "./category-item"
import type { CompletedSkill } from "./completed-skill"
import type { Quiz } from "./quiz"
import type { Skill } from "./skill"
import type { SkillContent } from "./skill-content"
import type { StartedQuiz } from "./started-quiz"

export type CategoryContentItem = CategoryItem &
  (
    | {
        itemType: "skills"
        content: Skill
        contentType: "skills"
        itemProgress?: CompletedSkill
        skillContent?: SkillContent
      }
    | {
        itemType: "quizzes"
        content: Quiz
        contentType: "quizzes"
        itemProgress?: StartedQuiz
      }
  )
