import { SkillContentDisplay } from "@/components/ui/skill-json"
import { useSkillContent } from "../services/use-skill-content"

export function SkillContentRenderer({ contentUrl }: { contentUrl: string }) {
  const { content } = useSkillContent(contentUrl)
  return <SkillContentDisplay data={content} />
}
