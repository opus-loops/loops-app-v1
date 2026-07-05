import { createFileRoute } from "@tanstack/react-router"

import { ResetPasswordScreen } from "@/modules/authentication/features/reset-password/components/reset-password-screen"
import { FirstInstallShell } from "@/modules/shared/shell/first_install/first-install"
import { TraceRegion } from "@/modules/shared/telemetry/trace-region"

export const Route = createFileRoute("/reset-password")({
  component: function ResetPasswordRoute() {
    return (
      <TraceRegion name="ResetPassword" type="route">
        <FirstInstallShell target={<ResetPasswordScreen />} />
      </TraceRegion>
    )
  },
})
