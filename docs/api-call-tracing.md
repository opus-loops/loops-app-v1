# API call tracing and caller context

This document explains how outbound API calls (axios → backend API) are traced on the server, how each call is tagged with **who invoked it** (loader, `beforeLoad`, React Query, server function, etc.), and how to query that data in **Azure Log Analytics**.

> **Implementation index:** `\`path/to/file.ts:Lstart–Lend\`` — source line range for the described behavior.

**Quick reference:** [telemetry-reference.md](./telemetry-reference.md) — full architecture, pipeline, and module map.

For general telemetry setup (env vars, architecture, metrics catalog), see [azure-monitor-opentelemetry.md](./azure-monitor-opentelemetry.md).

For **which routes and hooks are instrumented** and how to add new frames, see [call-path-instrumentation.md](./call-path-instrumentation.md).

---

## What this gives you

Every server-side axios call to the Loops backend produces:

1. **A dependency span** named `apiClient.{METHOD}.{resource}` — `axios-hooks.ts:57-58`.
2. **Caller attributes** on that span — `call-context-path.ts:19-46`, attached `axios-hooks.ts:53-64`.
3. **Custom metrics** (`http.client.request.duration`, `http.client.errors`) — `registry-factory.ts:151-189`.

Typical question this answers: _“Why did `/users/logged` get called twice on `/explore` — was it `beforeLoad`, a suspense query, or an invalidation?”_

---

## Trace hierarchy (example)

When a user opens `/explore` while logged in:

```text
GET /explore                          ← page request span (incoming)
└─ beforeLoad./explore                ← route guard span
   └─ query.fetch                      ← React Query prefetch in beforeLoad
      └─ serverFn.isAuthenticated      ← TanStack server function
         └─ apiClient.GET.users.logged ← outbound API dependency
```

On the **browser**, server functions call `/_serverFn` over HTTP. The full call path is propagated via the `x-loops-call-stack` header (JSON array of frames) so the server can record breadcrumbs like `__root > Home > useAuth > isAuthenticated > api:users.logged`.

---

## Full call path (`api.caller.path`)

Each API span includes a human-readable breadcrumb of every frame from React UI down to the outbound request.

| Span attribute     | Metric dimension | Example                                                                      | Source |
| ------------------ | ---------------- | ---------------------------------------------------------------------------- | ------ |
| `api.caller.path`  | `caller_path`    | `__root > Home > useAuth > query.fetch > isAuthenticated > api:users.logged` | `call-context-path.ts:29` |
| `api.caller.depth` | —                | Number of frames in the path                                                 | `call-context-path.ts:28` |

### How frames are collected

| Frame type                                    | Source                                                                  | Lines |
| --------------------------------------------- | ----------------------------------------------------------------------- | ----- |
| `route` / `component`                         | `<TraceRegion name="..." type="route\|component">` in routes and shells | `trace-region.tsx` |
| `hook`                                        | `useCallPathSegment("hook", "useAuth")` inside hooks                    | `use-call-path-segment.ts:8-18` |
| `beforeLoad`, `loader`, `query.*`, `serverFn` | Existing `runWithCallContext` instrumentation                           | `run-with-call-context.ts:79-108`, `helpers.ts:47-62`, `middleware.ts:63-70` |
| `api`                                         | Appended on axios response/error with normalized resource name          | `axios-hooks.ts:88-91`, `resource.ts:7-22` |

### Example path

```text
__root > Home > useAuth > query.suspense > isAuthenticated > api:users.logged
```

Wire format: header `x-loops-call-stack` = JSON array — `call-context-wire.ts:4`, encode `58-60`, decode `43-55`.

---

## Caller types (`api.caller.type`)

Valid literals: `call-context-wire.ts:6-22`.

| Value              | Meaning                                                                 | Source |
| ------------------ | ----------------------------------------------------------------------- | ------ |
| `beforeLoad`       | TanStack Router `beforeLoad` hook (wrapped with `instrumentBeforeLoad`) | `helpers.ts:47-62` |
| `loader`           | TanStack Router `loader` hook                                           | (reserved — no `instrumentLoader` today) |
| `serverFn`         | TanStack Start server function handler                                  | `middleware.ts:63-70` |
| `query.fetch`      | `queryClient.fetchQuery()` (often from `beforeLoad`)                    | `create-instrumented-query-client.ts` |
| `query.prefetch`   | `queryClient.prefetchQuery()`                                           | `create-instrumented-query-client.ts` |
| `query.suspense`   | `useSuspenseQuery` / default query fetch (no outer context)             | `create-instrumented-query-client.ts` |
| `query.invalidate` | `queryClient.invalidateQueries()`                                       | `create-instrumented-query-client.ts` |
| `query.refetch`    | `queryClient.refetchQueries()`                                          | `create-instrumented-query-client.ts` |
| `mutation`         | React Query mutation                                                    | `create-instrumented-query-client.ts` |
| `tokenRefresh`     | Session refresh inside `instanceFactory()`                              | `axios.ts` |
| `unknown`          | Fallback when context could not be determined                           | — |

### Related attributes

Attribute keys set in `getCallStackAttributes()` — `call-context-path.ts:27-45`.

| Span attribute            | Metric dimension      | Description                                             |
| ------------------------- | --------------------- | ------------------------------------------------------- |
| `api.caller.type`         | `caller_type`         | Primary caller (see table above)                        |
| `api.caller.path`         | `caller_path`         | Full breadcrumb path (see below)                        |
| `api.caller.name`         | `caller_name`         | Route id, server fn name, or serialized query key       |
| `api.caller.query_key`    | `caller_query_key`    | React Query key, e.g. `["authenticated"]`               |
| `api.caller.route_id`     | `caller_route_id`     | Route path when known, e.g. `/explore`                  |
| `api.caller.triggered_by` | `caller_triggered_by` | Parent caller (e.g. `query.fetch` → `serverFn`)         |
| `browser.session.id`      | `browser_session_id`  | Browser tab session (group all calls from one tab open) |

Resource labels use dots instead of slashes: `/users/logged` → `users.logged` — `resource.ts:7-22`.

---

## Browser tab session id

| Concept              | Detail                                                                                                           | Source |
| -------------------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| **What it is**       | UUID per tab, stored in `sessionStorage` (`loops.browserSessionId`)                                              | `browser-session.ts:7`, `browser-session-client.ts:61-68` |
| **New tab**          | New `sessionStorage` → new session id                                                                            | `browser-session-client.ts:41-48` |
| **Header**           | `x-loops-session-id` on browser fetch + echoed on page responses                                                 | `browser-session.ts:4`, `request.ts:142-153` |
| **SSR bootstrap**    | Server generates id on first page load; embedded in `<meta name="loops-session-id">`; client adopts on hydration | `browser-session.ts:10`, `browser-session-client.ts:23-38` |
| **Span attribute**   | `browser.session.id`                                                                                             | `browser-session.ts:8-14` |
| **Metric dimension** | `browser_session_id` on `http.client.request.duration`                                                           | `registry-factory.ts:177` |

> **Not the auth cookie.** The JWT `session` cookie is separate (login tokens). `browser.session.id` tracks a **tab visit**, not authentication state.

### Lifecycle

```text
New tab → SSR page request (no header) → server creates UUID
       → HTML includes <meta name="loops-session-id">
       → response header x-loops-session-id
       → client stores in sessionStorage
       → all /_serverFn + fetch calls send header
       → all apiClient.* spans/metrics include browser.session.id
```

---

## How it works in code

### Automatic (no action required)

| Layer                | Module                                                           | What it does                                                              | Lines |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ----- |
| Axios interceptors   | `src/server/telemetry/axios-hooks.ts`                            | Creates `apiClient.*` spans, records metrics, injects trace headers       | L31–L165 |
| Route hooks          | `src/server/telemetry/helpers.ts`                                | `instrumentBeforeLoad` sets call context                                  | L47–L62 |
| Server fn middleware | `src/server/telemetry/middleware.ts`                             | Reads `x-loops-call-stack`, sets `serverFn` context                       | L49–L119 |
| Query client         | `src/modules/shared/query/create-instrumented-query-client.ts`   | Tags `fetchQuery`, invalidations, suspense fetches, mutations             | — |
| Client bridge        | `src/modules/shared/telemetry/install-client-telemetry-fetch.ts` | Session header + call context on browser fetch                            | L17–L80 |
| Browser session      | `src/modules/shared/telemetry/browser-session*.ts`               | Tab session id create/validate/persist                                    | `browser-session.ts`, `browser-session-client.ts` |
| Context runtime      | `src/modules/shared/telemetry/run-with-call-context.ts`          | Client stack + server ALS bridge (no `node:async_hooks` in client bundle) | L33–L108 |
| Effect helpers       | `src/modules/shared/telemetry/effect.ts`                         | `runSyncOrElse` / `runSyncExitOrElse` (no try/catch)                      | L7–L26 |

### Router wiring

`src/router.tsx:L18-19` creates an instrumented `QueryClient` and installs the client fetch hook. No extra setup per route.

### Cache hits

If React Query serves cached data, **`queryFn` does not run** → no server function → **no API span**. That is expected; only real network calls appear in dependencies.

---

## Enable and verify locally

### 1. Environment

Set in `.env` (server-only — never `VITE_` prefix):

```bash
TELEMETRY_ENABLED=true
APPLICATIONINSIGHTS_CONNECTION_STRING=InstrumentationKey=...;IngestionEndpoint=...
TELEMETRY_TRACES_SAMPLE_RATE=1
OTEL_SERVICE_NAME=loops-app
```

### 2. Confirm telemetry is up

```bash
curl -s http://localhost:3001/ready | jq .
# Expect: "telemetry": "up"
```

### 3. Generate traffic

Load a page that hits the API, for example `/explore` or `/auth` (after login flow). Each page navigation that runs `beforeLoad` + auth check should emit at least one `apiClient.GET.users.logged` dependency when not cached.

### 4. Correlation from the browser

Instrumented page responses include:

- `x-correlation-id` — single page request trace
- `x-loops-session-id` — tab session (persists until tab closes)

Use either in Log Analytics (see queries below).

---

## Where to look in Azure

### Application Insights portal (UI)

1. Open the **Application Insights** resource linked to your Log Analytics workspace.
2. **Investigate → Transaction search**
   - Filter **Dependency name** contains `apiClient.`
   - Or open a **Request** (`GET /explore`) and expand **Related items** → child dependencies
3. **Monitoring → Logs** — run KQL (same queries as workspace Logs).
4. **Metrics → Custom metrics** — chart `http.client.request.duration` with split by `caller_type` / `resource`.

Ingestion delay is usually **2–5 minutes**.

### Log Analytics workspace

**Logs** blade on the workspace (or App Insights **Monitoring → Logs**). Data lands in classic Application Insights tables (`requests`, `dependencies`, `customMetrics`, …) when using the OpenTelemetry distro with a connection string.

---

## Log Analytics tables (cheat sheet)

| Table           | Contains                         | Use for                                        |
| --------------- | -------------------------------- | ---------------------------------------------- |
| `requests`      | Incoming page HTTP requests      | Page load latency, status, `operation_Id` root |
| `dependencies`  | Outbound calls (axios API spans) | **Primary table for API call tracing**         |
| `traces`        | Span/log events                  | Span events, exceptions, detailed messages     |
| `exceptions`    | Unhandled / recorded exceptions  | Server failures                                |
| `customMetrics` | OTel histograms/counters         | Aggregated API duration, error rates by caller |
| `customEvents`  | Custom event telemetry           | Auth redirects, etc.                           |

Join key for end-to-end views: **`operation_Id`** (same value on request + its dependencies).

Custom OTel attributes appear under:

- **`customDimensions`** on `dependencies`, `requests`, `traces`
- **`customDimensions`** on `customMetrics` (metric labels like `caller_type`, `resource`)

Workspace-based resources may expose **`AppDependencies`**, **`AppRequests`**, etc. with **`Properties`** instead of `customDimensions`. Queries below note both patterns.

---

## How to write KQL for request tracing

### Step 1 — Pick a time window

Always scope time first (reduces cost and noise):

```kusto
| where timestamp > ago(24h)   // classic AI tables
| where TimeGenerated > ago(24h)   // workspace-based App* tables
```

### Step 2 — Filter the telemetry type

| Goal                  | Table           | Filter                                                |
| --------------------- | --------------- | ----------------------------------------------------- |
| Page loads            | `requests`      | `name startswith "GET "` or `url contains "/explore"` |
| API outbound calls    | `dependencies`  | `name startswith "apiClient."`                        |
| Slow API (aggregated) | `customMetrics` | `name == "http.client.request.duration"`              |

### Step 3 — Extract JSON properties

Classic Application Insights:

```kusto
| extend callerType = tostring(customDimensions["api.caller.type"])
```

If empty, inspect raw keys once:

```kusto
dependencies
| where timestamp > ago(1h)
| where name startswith "apiClient."
| take 1
| project customDimensions
```

Workspace-based:

```kusto
| extend callerType = tostring(Properties["api.caller.type"])
```

### Step 4 — Join request → API call

Use `operation_Id` to link a page request to its dependencies:

```kusto
requests
| where timestamp > ago(1h)
| where name == "GET /explore"
| project operation_Id, pageTime = timestamp, page = name, duration, success
| join kind=inner (
    dependencies
    | where timestamp > ago(1h)
    | where name startswith "apiClient."
) on operation_Id
| extend callerType = tostring(customDimensions["api.caller.type"])
| project pageTime, page, apiCall = name, apiDuration = duration, success1, resultCode, callerType
| order by pageTime desc
```

### Step 5 — Aggregate for monitoring

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| extend callerType = tostring(customDimensions["api.caller.type"])
| summarize
    calls = count(),
    avgMs = avg(duration),
    p95Ms = percentile(duration, 95),
    failures = countif(success == false)
  by name, callerType
| order by calls desc
```

---

## Ready-to-use queries

### All API calls with caller + session context

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| extend
    sessionId = tostring(customDimensions["browser.session.id"]),
    callerType = tostring(customDimensions["api.caller.type"]),
    callerName = tostring(customDimensions["api.caller.name"]),
    queryKey = tostring(customDimensions["api.caller.query_key"]),
    routeId = tostring(customDimensions["api.caller.route_id"]),
    triggeredBy = tostring(customDimensions["api.caller.triggered_by"])
| project timestamp, name, duration, success, resultCode,
          sessionId, callerType, callerName, queryKey, routeId, triggeredBy, operation_Id
| order by timestamp desc
```

### Group all API calls for one tab session

Replace the session id with a value from logs or the `x-loops-session-id` response header:

```kusto
let tabSession = "<paste-browser-session-id>";
dependencies
| where timestamp > ago(7d)
| where name startswith "apiClient."
| where tostring(customDimensions["browser.session.id"]) == tabSession
| extend callerType = tostring(customDimensions["api.caller.type"])
| project timestamp, name, duration, success, resultCode, callerType
| order by timestamp asc
```

### Count API calls per tab session

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| extend sessionId = tostring(customDimensions["browser.session.id"])
| where isnotempty(sessionId)
| summarize
    apiCalls = count(),
    distinctEndpoints = dcount(name),
    avgMs = avg(duration),
    errors = countif(success == false)
  by sessionId
| order by apiCalls desc
```

### Full tab journey: page requests + API calls

```kusto
let tabSession = "<paste-browser-session-id>";
union
  (requests
   | where timestamp > ago(7d)
   | extend sessionId = tostring(customDimensions["browser.session.id"])
   | where sessionId == tabSession
   | project timestamp, kind = "page", name, duration, success),
  (dependencies
   | where timestamp > ago(7d)
   | where name startswith "apiClient."
   | extend sessionId = tostring(customDimensions["browser.session.id"])
   | where sessionId == tabSession
   | project timestamp, kind = "api", name, duration, success)
| order by timestamp asc
```

### Find calls from a specific caller (e.g. beforeLoad only)

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| where tostring(customDimensions["api.caller.type"]) == "beforeLoad"
| summarize count(), avg(duration) by name, routeId = tostring(customDimensions["api.caller.route_id"])
| order by count_ desc
```

### Duplicate API calls per page load

Useful to spot redundant fetches (same resource + operation):

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| summarize apiCalls = count() by operation_Id, name
| where apiCalls > 1
| join kind=inner (
    requests | where timestamp > ago(24h) | project operation_Id, page = name, timestamp
) on operation_Id
| project timestamp, page, name, apiCalls
| order by apiCalls desc
```

### Trace one user journey by correlation id

If you have `x-correlation-id` from a response header:

```kusto
let cid = "<paste-correlation-id>";
union requests, dependencies, traces
| where timestamp > ago(7d)
| where tostring(customDimensions["correlation.id"]) == cid
   or tostring(customDimensions["requestId"]) == cid
| project timestamp, itemType, name, duration, success, customDimensions
| order by timestamp asc
```

### API error rate by resource and caller

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| extend
    callerType = tostring(customDimensions["api.caller.type"]),
    resource = name
| summarize
    total = count(),
    failed = countif(success == false or toint(resultCode) >= 500)
  by resource, callerType
| extend errorRate = 100.0 * failed / total
| where total > 10
| order by errorRate desc
```

### Custom metric — average API latency by caller

```kusto
customMetrics
| where timestamp > ago(24h)
| where name == "http.client.request.duration"
| extend
    caller_type = tostring(customDimensions.caller_type),
    resource = tostring(customDimensions.resource),
    method = tostring(customDimensions.method)
| summarize avgMs = avg(value), count = count() by resource, method, caller_type
| order by avgMs desc
```

### Custom metric — group by full call path

```kusto
customMetrics
| where timestamp > ago(24h)
| where name == "http.client.request.duration"
| extend
    caller_path = tostring(customDimensions.caller_path),
    resource = tostring(customDimensions.resource)
| where isnotempty(caller_path)
| summarize count = count(), avgMs = avg(value) by caller_path, resource
| order by count desc
```

### Dependency span — filter by call path

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| extend callerPath = tostring(customDimensions["api.caller.path"])
| where callerPath has "useAuth"
| project timestamp, name, callerPath, duration, success
| order by timestamp desc
```

### Server function span (parent of API call)

```kusto
dependencies
| where timestamp > ago(24h)
| where name startswith "apiClient."
| join kind=inner (
    dependencies
    | where timestamp > ago(24h)
    | where name startswith "auth." or name startswith "serverFn."
) on operation_Id
| extend
    api = name,
    serverFn = name1,
    callerType = tostring(customDimensions["api.caller.type"])
| project timestamp, operation_Id, serverFn, api, duration, callerType
| order by timestamp desc
```

> **Note:** Server function spans use names like `auth.sessionCheck` or `serverFn.{name}` from `serverFunctionSpanName()` in `helpers.ts:120-122`.

---

## Suggested dashboards and alerts

| Monitor             | Query idea                                                                   | Alert condition                    |
| ------------------- | ---------------------------------------------------------------------------- | ---------------------------------- |
| API p95 latency     | `customMetrics` / `dependencies` grouped by `resource`                       | p95 > threshold for 5 min          |
| 5xx dependency rate | `dependencies` where `name startswith "apiClient."`                          | `failed / total > 1%`              |
| Auth check storm    | `dependencies` where `name == "apiClient.GET.users.logged"` by `caller_type` | sudden spike in `query.invalidate` |
| Page errors         | `requests` where `success == false`                                          | count > baseline                   |

Pin frequently used queries in Log Analytics **Queries** or App Insights **Workbooks**.

---

## Troubleshooting empty results

| Symptom                            | Check                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| No rows at all                     | `TELEMETRY_ENABLED=true`, valid connection string, `GET /ready` → `"telemetry": "up"` |
| Requests but no `apiClient.*`      | Page may not hit backend (cache hit, static route, or auth skipped)                   |
| Dependencies without caller fields | Old deploy before caller context; redeploy and rebuild `instrument.server.mjs`        |
| Missing traces                     | Lower `TELEMETRY_TRACES_SAMPLE_RATE` reduces volume; raise temporarily in dev         |
| Wrong table names                  | Run `search "*"` or use **Application Insights → Tables** to list available tables    |

---

## Related docs

- [azure-monitor-opentelemetry.md](./azure-monitor-opentelemetry.md) — full telemetry architecture and env vars
- [auth-redirect-telemetry.md](./auth-redirect-telemetry.md) — auth redirect metrics
- [refresh-token.md](./refresh-token.md) — token refresh instrumentation overlap
