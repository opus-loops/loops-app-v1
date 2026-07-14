/**
 * Azure Monitor OpenTelemetry startup.
 *
 * Initializes SDK via Node preload (`instrument.ts` → `instrument.server.mjs`).
 * Registry construction lives in {@link ./registry-factory}; axios hooks in {@link ./axios-hooks}.
 */
import { DefaultAzureCredential } from "@azure/identity"
import { useAzureMonitor } from "@azure/monitor-opentelemetry"
import { Effect } from "effect"

import type { TelemetryConfig } from "./config"
import type { TelemetryRegistry } from "./types"

import { createTelemetryConfig, describeTelemetryBootstrap } from "./config"
import { runSyncExitOrElse } from "./effect"
import { createNoopTelemetryRegistry, setTelemetry } from "./registry"
import { createActiveRegistry } from "./registry-factory"

let started = false

type AzureMonitorBootstrap = {
  connectionString: string
  isProduction: boolean
  samplingRatio: number
}

/**
 * Build {@link useAzureMonitor} options from validated bootstrap fields.
 *
 * Disables browser SDK and auto incoming HTTP spans (page routes instrumented manually).
 * Production uses {@link DefaultAzureCredential} for AAD auth.
 */
export function buildAzureMonitorOptions({
  connectionString,
  isProduction,
  samplingRatio,
}: AzureMonitorBootstrap) {
  return {
    azureMonitorExporterOptions: {
      connectionString,
      ...(isProduction && {
        credential: new DefaultAzureCredential(),
      }),
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
    samplingRatio,
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
  if (started && globalThis.__LOOPS_TELEMETRY__) {
    return globalThis.__LOOPS_TELEMETRY__
  }

  const config = createTelemetryConfig(env)

  if (config.debug)
    console.info(
      "[telemetry] bootstrap",
      describeTelemetryBootstrap(config, env),
    )

  if (!config.enabled || config.connectionString === undefined) {
    const registry = createNoopTelemetryRegistry("disabled")
    setTelemetry(registry)
    started = true
    logServerLifecycle(registry, config, disabledReason(config))
    return registry
  }

  const bootstrap = {
    connectionString: config.connectionString,
    isProduction: config.isProduction,
    samplingRatio: config.samplingRatio,
    serviceName: config.serviceName,
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
          sampleRate: bootstrap.samplingRatio,
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

function disabledReason(config: TelemetryConfig): string {
  if (!config.enabled) return "TELEMETRY_ENABLED is false"

  if (config.missingConnectionString)
    return "APPLICATIONINSIGHTS_CONNECTION_STRING is missing"

  if (config.invalidConnectionString)
    return "APPLICATIONINSIGHTS_CONNECTION_STRING is malformed"

  return "Telemetry disabled"
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
