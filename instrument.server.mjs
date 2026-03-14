import * as Sentry from "@sentry/tanstackstart-react"

Sentry.init({
  dsn: "https://b57fbc739c7ab5e48db3d8de3fea5dd0@o4510999464378368.ingest.de.sentry.io/4510999717478480",

  // Enable logs to be sent to Sentry
  enableLogs: true,

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production.
  // Learn more at https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
  tracesSampleRate: 1.0,
})
