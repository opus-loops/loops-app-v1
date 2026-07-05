import type {
  ErrorComponentProps,
  NotFoundRouteProps,
} from "@tanstack/react-router"

import { lazy, Suspense } from "react"

const LazyGlobalErrorComponent = lazy(() =>
  import("@/modules/shared/components/common/global-error-component").then(
    (module) => ({ default: module.GlobalErrorComponent }),
  ),
)

const LazyNotFoundComponent = lazy(() =>
  import("@/modules/shared/components/common/not-found-component").then(
    (module) => ({ default: module.NotFoundComponent }),
  ),
)

export function DefaultErrorComponent(props: ErrorComponentProps) {
  return (
    <Suspense fallback={null}>
      <LazyGlobalErrorComponent {...props} />
    </Suspense>
  )
}

export function DefaultNotFoundComponent(_props: NotFoundRouteProps) {
  return (
    <Suspense fallback={null}>
      <LazyNotFoundComponent />
    </Suspense>
  )
}
