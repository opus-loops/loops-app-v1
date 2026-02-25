import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"
import { fetchContentFn } from "./fetch-content-fn"

export const skillContentQuery = (url: string) =>
  queryOptions({
    queryKey: ["skill-content", url],
    queryFn: async () => {
      const response = await fetchContentFn({
        data: { url },
      })

      if (response._tag === "Failure") {
        const message = `Failed to fetch skill content: ${response.error.message}`
        throw new Error(message)
      }

      return response.value
    },
  })

export function useSkillContent(url: string) {
  const { data, isLoading, isError } = useSuspenseQuery(skillContentQuery(url))

  return {
    markdownContent: data.content,
    isLoading,
    isError,
  }
}
