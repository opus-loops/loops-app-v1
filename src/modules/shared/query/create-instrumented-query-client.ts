import type { QueryKey } from "@tanstack/react-query"

import { QueryClient } from "@tanstack/react-query"

import type {
  ApiCallContext,
  ApiCallSource,
} from "@/modules/shared/telemetry/call-context.types"

import {
  readCallContext,
  runWithCallContext,
} from "@/modules/shared/telemetry/run-with-call-context"

/** QueryClient with fetch / invalidate / refetch call-site context for API tracing. */
export function createInstrumentedQueryClient(): QueryClient {
  const queryClient = new QueryClient()
  instrumentQueryCache(queryClient)
  instrumentMutationCache(queryClient)

  const wrap = <T>(context: ApiCallContext, fn: () => Promise<T>): Promise<T> =>
    Promise.resolve(runWithCallContext(context, fn))

  const originalFetchQuery = queryClient.fetchQuery.bind(queryClient)
  queryClient.fetchQuery = (options) =>
    wrap(
      {
        name: formatQueryKey(options.queryKey),
        queryKey: formatQueryKey(options.queryKey),
        type: "query.fetch",
      },
      () => originalFetchQuery(options),
    )

  const originalPrefetchQuery = queryClient.prefetchQuery.bind(queryClient)
  queryClient.prefetchQuery = (options) =>
    wrap(
      {
        name: formatQueryKey(options.queryKey),
        queryKey: formatQueryKey(options.queryKey),
        type: "query.prefetch",
      },
      () => originalPrefetchQuery(options),
    )

  const originalInvalidateQueries =
    queryClient.invalidateQueries.bind(queryClient)
  queryClient.invalidateQueries = (filters) =>
    wrap(
      {
        name: summarizeQueryFilter(filters),
        type: "query.invalidate",
      },
      () => originalInvalidateQueries(filters),
    )

  const originalRefetchQueries = queryClient.refetchQueries.bind(queryClient)
  queryClient.refetchQueries = (filters) =>
    wrap(
      {
        name: summarizeQueryFilter(filters),
        type: "query.refetch",
      },
      () => originalRefetchQueries(filters),
    )

  return queryClient
}

/** Stable, low-cardinality label for a React Query key. */
export function formatQueryKey(queryKey: QueryKey): string {
  return JSON.stringify(queryKey)
}

function instrumentMutationCache(queryClient: QueryClient): void {
  const cache = queryClient.getMutationCache()
  const originalBuild = cache.build.bind(cache)

  cache.build = (client, options, state) => {
    const mutation = originalBuild(client, options, state)
    const originalExecute = mutation.execute.bind(mutation)
    const mutationLabel =
      options.mutationKey !== undefined
        ? formatQueryKey(options.mutationKey)
        : "mutation"

    mutation.execute = (variables) =>
      Promise.resolve(
        runWithCallContext({ name: mutationLabel, type: "mutation" }, () =>
          originalExecute(variables),
        ),
      )

    return mutation
  }
}

function instrumentQueryCache(queryClient: QueryClient): void {
  const cache = queryClient.getQueryCache()
  const originalBuild = cache.build.bind(cache)

  cache.build = (client, options, state) => {
    const query = originalBuild(client, options, state)
    const originalFetch = query.fetch.bind(query)
    const queryKeyLabel = formatQueryKey(query.queryKey)

    query.fetch = (fetchOptions, queryFetchOptions) => {
      const active = readCallContext()
      const metaType = (
        fetchOptions?.meta as { callerType?: ApiCallSource } | undefined
      )?.callerType

      const caller: ApiCallContext = active
        ? {
            ...active,
            name: active.name ?? queryKeyLabel,
            queryKey: queryKeyLabel,
          }
        : {
            name: queryKeyLabel,
            queryKey: queryKeyLabel,
            type: metaType ?? "query.suspense",
          }

      return Promise.resolve(
        runWithCallContext(caller, () =>
          originalFetch(fetchOptions, queryFetchOptions),
        ),
      )
    }

    return query
  }
}

function summarizeQueryFilter(
  filters: Parameters<QueryClient["invalidateQueries"]>[0],
): string {
  if (!filters) return "all"
  if ("queryKey" in filters) return formatQueryKey(filters.queryKey)
  return "filtered"
}
