import { ResetPasswordForm } from "./reset-password-form"
import { ResetPasswordStepperProvider } from "./reset-password-stepper"

export function ResetPasswordScreen() {
  return (
    <div className="bg-loops-background flex min-h-screen w-full flex-col justify-center px-4 py-6">
      <div className="flex size-full flex-col items-start justify-center gap-y-10">
        <ResetPasswordStepperProvider>
          <ResetPasswordForm />
        </ResetPasswordStepperProvider>
      </div>
    </div>
  )
}
