import { BottomTabNavigator } from "@/modules/shared/components/navigation/bottom-tab-navigator"
import { authenticatedQuery, useAuth } from "@/modules/shared/guards/use-auth"
import { CategorySelectionShell } from "@/modules/shared/shell/category_selection/category-selection-shell"
import { ConfirmationShell } from "@/modules/shared/shell/confirmation/confirmation-shell"
import { OnboardingShell } from "@/modules/shared/shell/onboarding/onboarding-shell"
import { createFileRoute } from "@tanstack/react-router"
import z from "zod"

export const Route = createFileRoute("/leaderboard")({
  beforeLoad: async ({ context }) =>
    await context.queryClient.ensureQueryData(authenticatedQuery),
  validateSearch: z.object({
    category: z
      .string()
      .refine((value) => value === "all" || /^[0-9a-fA-F]{24}$/.test(value))
      .optional(),
    type: z.enum(["details", "content"]).optional(),
  }),
  component: function RouteComponent() {
    const { user } = useAuth()
    const search = Route.useSearch()

    return (
      <ConfirmationShell
        target={
          <OnboardingShell
            target={
              <CategorySelectionShell
                searchParams={search}
                target={
                  <div className="relative min-h-screen">
                    <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-sm -translate-x-1/2">
                      <BottomTabNavigator />
                    </div>
                  </div>
                }
                user={user}
              />
            }
            user={user}
          />
        }
        user={user}
      />
    )
  },
})
