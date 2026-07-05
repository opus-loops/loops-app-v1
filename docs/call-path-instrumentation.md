# Call-path instrumentation guide

Practical reference for **where** to add manual telemetry frames in this app.

> **Implementation index:** `\`path/to/file.ts:Lstart–Lend\`` — source line range for the described behavior.

**Quick reference:** [telemetry-reference.md](./telemetry-reference.md) — full architecture and usage guide.

For how paths flow to Azure Monitor, KQL examples, and attribute catalog, see [api-call-tracing.md](./api-call-tracing.md).

---

## Two manual tools

| Tool                                    | Where             | Purpose                                           | Source |
| --------------------------------------- | ----------------- | ------------------------------------------------- | ------ |
| `<TraceRegion name="..." type="route">` | Route components  | Tag which **page** is mounted                     | `trace-region.tsx` |
| `useCallPathSegment("hook", "useFoo")`  | Custom data hooks | Tag which **hook** triggered a query or server fn | `use-call-path-segment.ts:8-18` |

Everything else is automatic:

- `beforeLoad` → `instrumentBeforeLoad` — `helpers.ts:47-62`
- React Query → `create-instrumented-query-client.ts`
- Server functions → `runWithCallContext` in handlers — `middleware.ts:63-70`
- Axios outbound calls → `axios-hooks.ts:31-165`

---

## When to instrument

### Add `TraceRegion` on a route when

- Route runs auth guard + data shells (`useAuth`, category shells)
- You need to distinguish pages that share the same shell stack (e.g. `/explore` vs `/leaderboard` vs `/profile`)
- Page is a debugging target for duplicate API calls

### Add `useCallPathSegment` on a hook when

- Hook wraps `useSuspenseQuery` / `useQuery` (page-load data)
- Hook wraps `useServerFn` for auth, profile, or onboarding flows
- Hook is shared across many components and `query.suspense` alone is ambiguous

### Skip when

- Redirect-only routes (`/login`, `/register` → `/auth`)
- Pure UI hooks (`useToast`, `usePageLoading`, steppers, context readers)
- Click-action hooks where `serverFn` name is already specific — add only when debugging that flow

---

## Instrumented routes

| Route file                                       | `TraceRegion` name | Lines (approx.) | Notes                         |
| ------------------------------------------------ | ------------------ | --------------- | ----------------------------- |
| `src/routes/__root.tsx`                          | `__root`           | L91–L95         | App shell, timezone server fn |
| `src/routes/index.tsx`                           | `Home`             | L34–L72         | Main tab, home screen         |
| `src/routes/explore.tsx`                         | `Explore`          | L23–L45         | Explore tab                   |
| `src/routes/leaderboard.tsx`                     | `Leaderboard`      | L23–L45         | Leaderboard tab               |
| `src/routes/profile.tsx`                         | `Profile`          | L23–L48         | Profile tab                   |
| `src/routes/profile_.settings.tsx`               | `Settings`         | L23–L48         | Settings hub                  |
| `src/routes/profile_.settings_.preferences.tsx`  | `Preferences`      | L26–L65         | Preferences form              |
| `src/routes/profile_.settings_.security.tsx`     | `Security`         | L24–L59         | Change password               |
| `src/routes/profile_.settings_.edit-profile.tsx` | `EditProfile`      | L24–L64         | Edit profile                  |
| `src/routes/auth.tsx`                            | `Auth`             | L39–L41         | Login / register / selector   |
| `src/routes/reset-password.tsx`                  | `ResetPassword`    | L10–L12         | Password reset flow           |

### Skipped routes

| Route file                | Why                                     | Source |
| ------------------------- | --------------------------------------- | ------ |
| `src/routes/login.tsx`    | Redirect alias to `/auth`, no component | L18 (empty TraceRegion) |
| `src/routes/register.tsx` | Redirect alias to `/auth`, no component | L19–L21 |

---

## Instrumented hooks

### Tier 1 — suspense query hooks (page-load API)

| Hook                    | File                                                                                            | Line |
| ----------------------- | ----------------------------------------------------------------------------------------------- | ---- |
| `useAuth`               | `src/modules/shared/guards/use-auth.ts`                                                         | L25 |
| `useExploreCategories`  | `src/modules/content-management/features/category-selection/services/use-explore-categories.ts` | L25 |
| `useExploreCategory`    | `src/modules/content-management/features/content-detail/services/use-explore-category.ts`       | L44 |
| `useCategoryContent`    | `src/modules/content-management/features/content-list/services/use-category-content.ts`         | L35 |
| `useSingleCategoryItem` | `src/modules/content-management/features/single-item/services/use-single-category-item.ts`      | L56 |
| `useQuizContent`        | `src/modules/shared/shell/selected_content/services/use-quiz-content.ts`                        | L47 |
| `useSubQuizContent`     | `src/modules/shared/shell/selected_content/services/use-sub-quiz-content.ts`                    | L55 |
| `useSkillContent`       | `src/modules/learning-experience/shell/services/use-skill-content.ts`                           | L24 |

### Tier 2 — auth and profile server-fn hooks

| Hook                   | File                                                                      | Line |
| ---------------------- | ------------------------------------------------------------------------- | ---- |
| `useLogin`             | `src/modules/authentication/features/login/services/use-login.ts`         | L11 |
| `useGoogleLogin`       | `src/modules/authentication/features/login/services/use-google-login.ts`  | L11 |
| `useRegister`          | `src/modules/authentication/features/register/services/use-register.ts`   | L9 |
| `useLogout`            | `src/modules/authentication/features/login/services/use-logout.ts`        | L11 |
| `useOnboarding`        | `src/modules/user-onboarding/features/welcome/services/use-onboarding.ts` | L13 |
| `useUpdatePreferences` | `src/modules/profile/hooks/use-update-preferences.ts`                     | L13 |
| `useUpdatePassword`    | `src/modules/profile/hooks/use-update-password.ts`                        | L12 |
| `useDeleteAccount`     | `src/modules/profile/hooks/use-delete-account.ts`                         | L13 |

### Deferred (add only when debugging)

Action/mutation hooks — `serverFn` middleware already tags the handler:

- `useStartQuiz`, `useStartSkill`, `useStartCategory`, `useCompleteSkill`
- `useSubmitVoucher`, `useStartChoiceQuestion`, `useValidateChoiceQuestion`
- `useStartSequenceOrder`, `useValidateSequenceOrder`, `useUpdateCurrentCategory`
- `useRequestResetPassword`, `useConfirmResetPassword`, `useConfirmAccount`, `useRequestConfirm`

UI-only hooks — never instrument:

- `usePageLoading`, `useToast`, `useGlobalError`
- `useSelectedContent`, `useSelectedSubQuiz`, `useOnboardingForm`
- `useQuizStepper`, `useSkillStepper`, `useResetPasswordStepper`, `useOnboardingStepper`
- `useSubQuizNavigation`, `useContentNavigation`

---

## Example paths after instrumentation

```text
__root > Explore > useAuth > query.fetch > isAuthenticated > api:users.logged
__root > Home > useExploreCategories > query.suspense > exploreCategoriesFn > api:...
__root > Profile > Settings > useDeleteAccount > serverFn.deleteAccount > api:...
__root > Auth > useLogin > serverFn.login > api:...
```

---

## How to add instrumentation

### New route with data

```tsx
import { TraceRegion } from "@/modules/shared/telemetry/trace-region"

export const Route = createFileRoute("/my-route")({
  component: function MyRoute() {
    return (
      <TraceRegion name="MyRoute" type="route">
        {/* existing JSX */}
      </TraceRegion>
    )
  },
})
```

Use a stable PascalCase `name` (appears in `api.caller.path`). Prefer `type="route"` for file routes.

### New data hook

```ts
import { useCallPathSegment } from "@/modules/shared/telemetry/use-call-path-segment"

export function useMyData() {
  useCallPathSegment("hook", "useMyData")

  // useSuspenseQuery / useServerFn ...
}
```

`name` must match the hook export name exactly.

### Optional: shell component frame

For deeper nesting inside shared shells, wrap shell output:

```tsx
<TraceRegion name="CategorySelectionShell" type="component">
  {children}
</TraceRegion>
```

Do **not** replace per-route `TraceRegion` — shells are shared across tabs.

---

## Checklist for new features

1. Route fetches data or uses `useAuth`? → `TraceRegion`
2. New `useSuspenseQuery` hook? → `useCallPathSegment`
3. New auth/profile/settings server-fn hook? → `useCallPathSegment`
4. One-off button action? → skip unless debugging
5. Update this doc when you add a frame

---

## Related files

| File                                                             | Role                                       | Lines |
| ---------------------------------------------------------------- | ------------------------------------------ | ----- |
| `src/modules/shared/telemetry/trace-region.tsx`                  | Route/component frame provider             | — |
| `src/modules/shared/telemetry/use-call-path-segment.ts`          | Hook frame registration                    | L8–L18 |
| `src/modules/shared/telemetry/run-with-call-context.ts`          | Stack merge (React + runtime)              | L33–L108 |
| `src/modules/shared/telemetry/call-context-wire.ts`              | `x-loops-call-stack` header                | L4–L60 |
| `src/modules/shared/telemetry/install-client-telemetry-fetch.ts` | Client fetch propagation                   | L17–L80 |
| `src/server/telemetry/helpers.ts`                                | `instrumentBeforeLoad`                     | L47–L62 |
