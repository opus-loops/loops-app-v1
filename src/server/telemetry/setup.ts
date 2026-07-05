/**
 * Azure Monitor OpenTelemetry startup.
 *
 * Initializes SDK via Node preload (`instrument.ts` → `instrument.server.mjs`).
 * Registry construction lives in {@link ./registry-factory}; axios hooks in {@link ./axios-hooks}.
 */
import { useAzureMonitor } from "@azure/monitor-opentelemetry"
import { Effect } from "effect"

import { registerServerCallContextBridge } from "@/modules/shared/telemetry/run-with-call-context"

import type { TelemetryConfig } from "./config"
import type { TelemetryRegistry } from "./types"

import {
  getCallContext,
  getCallContextStack,
  runWithCallContextStack,
  runWithCallContext as runWithServerCallContext,
} from "./call-context"
import { parseTelemetryConfig } from "./config"
import { runSyncExitOrElse } from "./effect"
import { createNoopTelemetryRegistry, setTelemetry } from "./registry"
import { createActiveRegistry } from "./registry-factory"

let started = false

type AzureMonitorBootstrap = {
  connectionString: string
  tracesSampleRate: number
}

/**
 * Build {@link useAzureMonitor} options from validated bootstrap fields.
 *
 * Disables browser SDK and auto incoming HTTP spans (page routes instrumented manually).
 */
export function buildAzureMonitorOptions({
  connectionString,
  tracesSampleRate,
}: AzureMonitorBootstrap) {
  return {
    azureMonitorExporterOptions: {
      connectionString,
    },
    browserSdkLoaderOptions: {
      enabled: false,
    },
    instrumentationOptions: {
      azureSdk: { enabled: false },
      http: {
        disableIncomingRequestInstrumentation: true,
        enabled: true,
      },
    },
    samplingRatio: tracesSampleRate,
  }
}

/**
 * Initialize Azure Monitor and install the process-global telemetry registry.
 *
 * Idempotent: returns existing registry if already started.
 */
export function startTelemetry(
  env: NodeJS.ProcessEnv = process.env,
): TelemetryRegistry {
  registerServerCallContextBridge({
    get: getCallContext,
    getStack: getCallContextStack,
    run: runWithServerCallContext,
    runWithStack: runWithCallContextStack,
  })

  if (started && globalThis.__LOOPS_TELEMETRY__) {
    return globalThis.__LOOPS_TELEMETRY__
  }

  const config = parseTelemetryConfig(env)

  if (!config.enabled || config.connectionString === undefined) {
    const registry = createNoopTelemetryRegistry("disabled")
    setTelemetry(registry)
    started = true
    logServerLifecycle(registry, config, config.reason)
    return registry
  }

  const bootstrap = {
    connectionString: config.connectionString,
    serviceName: config.serviceName,
    tracesSampleRate: config.tracesSampleRate,
  }

  return runSyncExitOrElse(
    () => {
      useAzureMonitor(buildAzureMonitorOptions(bootstrap))
      const registry = createActiveRegistry(config)
      setTelemetry(registry)
      started = true

      const shutdown = () => {
        void Effect.runPromise(
          Effect.ignore(
            Effect.tryPromise({
              catch: (error) => error,
              try: () => registry.shutdown(),
            }),
          ),
        )
      }
      process.once("SIGTERM", shutdown)
      process.once("SIGINT", shutdown)

      void registry.withSpan("telemetry.startup", undefined, () => {
        registry.log("info", "Telemetry started", {
          sampleRate: bootstrap.tracesSampleRate,
          serviceName: bootstrap.serviceName,
        })
      })

      return registry
    },
    () => {
      const registry = createNoopTelemetryRegistry("down")
      setTelemetry(registry)
      started = true
      return registry
    },
  )
}

function logServerLifecycle(
  registry: TelemetryRegistry,
  config: TelemetryConfig,
  message: string,
): void {
  if (registry.enabled) return
  console.info(`[telemetry] ${message}`, {
    enabled: config.enabled,
    status: registry.status,
  })
}
