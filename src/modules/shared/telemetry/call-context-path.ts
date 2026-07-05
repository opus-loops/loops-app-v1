import type { ApiCallContext } from "./call-context.types"

const PATH_SEPARATOR = " > "

/** Human-readable label for one stack frame. */
export function formatCallFrame(frame: ApiCallContext): string {
  if (frame.type === "api" && frame.name) return `api:${frame.name}`
  if (frame.name) return frame.name
  return frame.type
}

/** Join stack frames into a single breadcrumb path. */
export function formatCallPath(stack: ReadonlyArray<ApiCallContext>): string {
  if (stack.length === 0) return ""
  return stack.map(formatCallFrame).join(PATH_SEPARATOR)
}

/** OpenTelemetry attributes for a full call path stack. */
export function getCallStackAttributes(
  stack: ReadonlyArray<ApiCallContext>,
  apiSuffix?: ApiCallContext,
): Record<string, string> {
  const fullStack = apiSuffix ? [...stack, apiSuffix] : stack
  if (fullStack.length === 0) return {}

  const leaf = fullStack.at(-1)
  const attrs: Record<string, string> = {
    "api.caller.depth": String(fullStack.length),
    "api.caller.path": formatCallPath(fullStack),
  }

  if (leaf) {
    attrs["api.caller.type"] = leaf.type
    if (leaf.name) attrs["api.caller.name"] = leaf.name
    if (leaf.queryKey) attrs["api.caller.query_key"] = leaf.queryKey
    if (leaf.routeId) attrs["api.caller.route_id"] = leaf.routeId
    if (leaf.triggeredBy) attrs["api.caller.triggered_by"] = leaf.triggeredBy
  }

  const parent = fullStack.at(-2)
  if (parent && !leaf?.triggeredBy) {
    attrs["api.caller.triggered_by"] = parent.type
  }

  return attrs
}
