import { serverEnv } from "./server-env"

type FetchHandler = (request: Request) => Promise<Response> | Response

export async function handleAppRequest(
  request: Request,
  fetchHandler: FetchHandler,
) {
  const pathname = new URL(request.url).pathname
  const response =
    pathname === "/health"
      ? healthResponse(request)
      : await fetchHandler(request)

  return withSecurityHeaders(request, response)
}

function appendOrigin(origins: Set<string>, value: string | undefined) {
  if (!value) return

  try {
    origins.add(new URL(value).origin)
  } catch {
    return
  }
}

function buildContentSecurityPolicy() {
  const connectOrigins = new Set<string>([
    "'self'",
    "https://accounts.google.com",
  ])

  appendOrigin(connectOrigins, process.env.VITE_API_URL)
  appendOrigin(connectOrigins, serverEnv.sentry.dsn)

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    "script-src 'self' 'unsafe-inline' https://accounts.google.com https://unpkg.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${Array.from(connectOrigins).join(" ")}`,
    "frame-src 'self' https://accounts.google.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ")
}

function healthResponse(request: Request) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response(null, {
      headers: {
        Allow: "GET, HEAD",
      },
      status: 405,
      statusText: "Method Not Allowed",
    })
  }

  const body = JSON.stringify({
    status: "ok",
    timestamp: new Date().toISOString(),
  })

  return new Response(request.method === "HEAD" ? null : body, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8",
    },
    status: 200,
  })
}

function isProduction() {
  return process.env.NODE_ENV === "production"
}

function isSecureRequest(request: Request) {
  if (request.headers.get("x-forwarded-proto") === "https") return true

  try {
    return new URL(request.url).protocol === "https:"
  } catch {
    return false
  }
}

function withSecurityHeaders(request: Request, response: Response) {
  const headers = new Headers(response.headers)

  headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  headers.set(
    "Permissions-Policy",
    "camera=(), geolocation=(), microphone=(), payment=()",
  )
  headers.set("X-Content-Type-Options", "nosniff")
  headers.set("X-Frame-Options", "DENY")

  if (isProduction()) {
    headers.set("Content-Security-Policy", buildContentSecurityPolicy())

    if (isSecureRequest(request)) {
      headers.set(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains",
      )
    }
  }

  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  })
}
