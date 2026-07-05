import { queryOptions, useSuspenseQuery } from "@tanstack/react-query"

import { useCallPathSegment } from "@/modules/shared/telemetry/use-call-path-segment"

import { fetchContentFn } from "./fetch-content-fn"

export const skillContentQuery = (url: string) =>
  queryOptions({
    queryFn: async () => {
      const response = await fetchContentFn({
        data: { url },
      })

      if (response._tag === "Failure") {
        throw new Error("Failed to fetch skill content")
      }

      return response.value
    },
    queryKey: ["skill-content", url],
  })

export function useSkillContent(url: string) {
  useCallPathSegment("hook", "useSkillContent")

  const { data, isError, isLoading } = useSuspenseQuery(skillContentQuery(url))

  return {
    content: data.content,
    isError,
    isLoading,
  }
}
