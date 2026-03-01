import { PreferencesForm } from "@/modules/profile/components/settings/preferences-form"
import { BottomTabNavigator } from "@/modules/shared/components/navigation/bottom-tab-navigator"
import { authenticatedQuery, useAuth } from "@/modules/shared/guards/use-auth"
import { CategorySelectionShell } from "@/modules/shared/shell/category_selection/category-selection-shell"
import { ConfirmationShell } from "@/modules/shared/shell/confirmation/confirmation-shell"
import { OnboardingShell } from "@/modules/shared/shell/onboarding/onboarding-shell"
import { Link, createFileRoute } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import z from "zod"

export const Route = createFileRoute("/profile_/settings_/preferences")({
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
                  <div className="bg-loops-background relative min-h-screen">
                    <div className="relative z-0">
                      <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col px-5 pt-10 pb-28">
                        <div className="mb-6 flex items-center gap-4">
                          <Link
                            to="/profile/settings"
                            className="-ml-2 rounded-full p-2 hover:bg-white/10"
                          >
                            <ChevronLeft className="text-loops-light h-6 w-6" />
                          </Link>
                          <h1 className="text-loops-light text-xl font-semibold">
                            Preferences
                          </h1>
                        </div>

                        <PreferencesForm user={user} />
                      </div>
                    </div>
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
