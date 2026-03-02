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
        throw new Error("Failed to fetch skill content")
      }

      return response.value
    },
  })

export function useSkillContent(url: string) {
  const { data, isLoading, isError } = useSuspenseQuery(skillContentQuery(url))

  return {
    content: data.content,
    isLoading,
    isError,
  }
}
