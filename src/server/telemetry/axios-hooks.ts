import type { trace } from "@opentelemetry/api"

import { context as otelContext } from "@opentelemetry/api"
import axios from "axios"

import type { TelemetryRegistry } from "./types"

import { isServerErrorStatus } from "./http-status"
import { normalizeApiResource } from "./resource"
import { decodeAxiosErrorTelemetry, decodeRequestStartMs } from "./schema"

const TELEMETRY_AXIOS_SPAN = Symbol.for("loops.telemetry.axiosSpan")

let axiosHooksInstalled = false

type AxiosLikeConfig = {
  baseURL?: string | undefined
  method?: string | undefined
  url?: string | undefined
}

/**
 * Install global axios interceptors for trace propagation and dependency metrics.
 *
 * Records duration and errors (5xx / missing status only) on the shared axios instance.
 */
export function installAxiosHooks(
  registry: TelemetryRegistry,
  tracer: ReturnType<typeof trace.getTracer>,
): void {
  if (axiosHooksInstalled) return
  axiosHooksInstalled = true

  axios.interceptors.request.use((config) => {
    const headers = registry.getTraceHeaders()
    const requestHeaders = config.headers
    if (headers.correlationId) {
      requestHeaders["x-correlation-id"] = headers.correlationId
    }
    if (headers.traceparent) {
      requestHeaders.traceparent = headers.traceparent
    }
    if (headers.tracestate) {
      requestHeaders.tracestate = headers.tracestate
    }
    requestHeaders["x-request-start"] = String(performance.now())

    const { method, resource } = resolveAxiosRequest(config)
    const span = tracer.startSpan(
      `apiClient.${method}.${resource}`,
      {
        attributes: {
          "http.method": method,
          resource,
        },
      },
      otelContext.active(),
    )
    ;(config as unknown as Record<symbol, unknown>)[TELEMETRY_AXIOS_SPAN] = span

    return config
  })

  axios.interceptors.response.use(
    (response) => {
      type AxiosSpan = {
        end: () => void
        setAttribute: (key: string, value: number) => void
      }
      const span = (response.config as unknown as Record<symbol, unknown>)[
        TELEMETRY_AXIOS_SPAN
      ] as AxiosSpan | undefined
      const startHeader = response.config.headers["x-request-start"]
      const start = decodeRequestStartMs(startHeader)
      const durationMs = Number.isFinite(start) ? performance.now() - start : 0
      const { method, resource } = resolveAxiosRequest(response.config)
      const isError = isServerErrorStatus(response.status)

      registry.metrics.recordApiClient({
        durationMs,
        error: isError,
        method,
        resource,
        statusCode: response.status,
        timedOut: false,
      })
      registry.metrics.recordDependency({
        durationMs,
        error: isError,
        retried: false,
        statusCode: response.status,
        timedOut: false,
      })

      span?.setAttribute("http.status_code", response.status)
      span?.end()

      return response
    },
    (error: unknown) => {
      const axiosError = decodeAxiosErrorTelemetry(error)
      const config = axiosError?.config
      const span = config
        ? ((config as unknown as Record<symbol, unknown>)[
            TELEMETRY_AXIOS_SPAN
          ] as { end: () => void } | undefined)
        : undefined
      const start = decodeRequestStartMs(config?.headers?.["x-request-start"])
      const durationMs = Number.isFinite(start) ? performance.now() - start : 0
      const statusCode = axiosError?.response?.status
      const code = axiosError?.code
      const timedOut = code === "ECONNABORTED" || code === "ETIMEDOUT"
      const { method, resource } = resolveAxiosRequest(config ?? {})
      const isError = isServerErrorStatus(statusCode)

      registry.metrics.recordApiClient({
        durationMs,
        error: isError,
        method,
        resource,
        statusCode,
        timedOut,
      })
      registry.metrics.recordDependency({
        durationMs,
        error: isError,
        retried: false,
        statusCode,
        timedOut,
      })

      span?.end()
      return Promise.reject(error)
    },
  )
}

function resolveAxiosRequest(config: AxiosLikeConfig): {
  method: string
  resource: string
} {
  const method = (config.method ?? "GET").toUpperCase()
  const requestUrl = config.url ?? ""
  const baseUrl = config.baseURL ?? ""
  const fullUrl = requestUrl.startsWith("http")
    ? requestUrl
    : `${baseUrl}${requestUrl}`

  return {
    method,
    resource: normalizeApiResource(fullUrl),
  }
}
