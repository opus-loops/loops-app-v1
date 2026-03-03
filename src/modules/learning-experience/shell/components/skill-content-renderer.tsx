import { useSkillContent } from "../services/use-skill-content"
import { SkillContentDisplay } from "@/components/ui/skill-json"

export function SkillContentRenderer({ contentUrl }: { contentUrl: string }) {
  const { content } = useSkillContent(contentUrl)
  return <SkillContentDisplay data={content} />
}
