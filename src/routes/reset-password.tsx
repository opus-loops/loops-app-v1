import { createFileRoute } from "@tanstack/react-router"

import { ResetPasswordScreen } from "@/modules/authentication/features/reset-password/components/reset-password-screen"

export const Route = createFileRoute("/reset-password")({
  component: function ResetPasswordRoute() {
    return <ResetPasswordScreen />
  },
})
