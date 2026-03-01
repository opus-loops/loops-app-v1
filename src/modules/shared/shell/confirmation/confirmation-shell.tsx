import { ConfirmAccountForm } from "@/modules/account-management/features/account-confirmation/services"
import type { User } from "@/modules/shared/domain/entities/user"
import type { ReactNode } from "react"
import { LoadingScreen } from "../../components/common/loading-screen"
import { usePageLoading } from "../../hooks/use-page-loading"

type ConfirmationScreenProps = { user: User }

type ConfirmationShellProps = { target: ReactNode; user: User }

export function ConfirmationShell({ target, user }: ConfirmationShellProps) {
  const isLoading = usePageLoading()

  if (isLoading) return <LoadingScreen />
  if (!user.isConfirmed) return <ConfirmationScreen user={user} />
  return target
}

function ConfirmationScreen({ user }: ConfirmationScreenProps) {
  return (
    <div className="bg-loops-background relative h-screen w-full overflow-hidden">
      {/* Main Content */}
      <div className="relative z-10 flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm space-y-8">
          {/* Title */}
          <h1 className="font-outfit text-loops-cyan text-center text-3xl font-bold tracking-tight">
            Email Verification
          </h1>

          {/* Description */}
          <p className="font-outfit text-loops-light text-center text-base leading-5 font-medium">
            We&apos;ve sent an SMS with an activation code to your Email{" "}
            <span className="break-all">{user.email}</span>
          </p>

          {/* Confirm Account Form */}
          <ConfirmAccountForm />
        </div>
      </div>
    </div>
  )
}
