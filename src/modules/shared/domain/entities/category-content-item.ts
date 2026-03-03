import type { CategoryItem } from "./category-item"
import type { CompletedSkill } from "./completed-skill"
import type { Quiz } from "./quiz"
import type { Skill } from "./skill"
import type { SkillContent } from "./skill-content"
import type { StartedQuiz } from "./started-quiz"

export type CategoryContentItem = (
  | {
      content: Quiz
      contentType: "quizzes"
      itemProgress?: StartedQuiz
      itemType: "quizzes"
    }
  | {
      content: Skill
      contentType: "skills"
      itemProgress?: CompletedSkill
      itemType: "skills"
      skillContent?: SkillContent
    }
) &
  CategoryItem
