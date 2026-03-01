import { useLogin } from "@/modules/authentication/features/login/services/use-login"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { PasswordInput } from "@/modules/shared/components/ui/password-input"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"

export function LoginForm() {
  const { handleLogin } = useLogin()
  const { error: toastError } = useToast()

  const form = useForm({
    defaultValues: { password: "", username: "" },
    validators: {
      onSubmitAsync: async ({ value }) => {
        const response = await handleLogin(value.username, value.password)

        if (response._tag === "Failure") {
          if (response.error.code === "invalid_credentials") {
            return {
              password: "Invalid username or password",
              username: "Invalid username or password",
            }
          }

          if (
            response.error.code === "user_password_not_set_or_invalid_provider"
          ) {
            toastError("Login Failed", {
              description:
                "You cannot login with password for this account type.",
            })
            return null
          }

          if (response.error.code === "invalid_input") {
            return response.error.payload
          }

          const message =
            "message" in response.error
              ? response.error.message
              : "An unexpected error occurred."

          toastError("Login Failed", { description: message })
          return null
        }

        return null
      },
    },
  })

  return (
    <form
      className="flex w-full flex-col items-start gap-y-8"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <div className="flex w-full flex-col items-start gap-y-4">
        <form.Field name="username">
          {(field) => {
            return (
              <div className="flex w-full flex-col items-start gap-y-1">
                <label
                  className="font-outfit text-loops-white text-sm leading-5 font-normal"
                  htmlFor={field.name}
                >
                  Username
                </label>
                <div className="bg-loops-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                  <div className="text-loops-cyan size-6 shrink-0 grow-0">
                    <UserIcon />
                  </div>
                  <Input
                    className="font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your username"
                    value={field.state.value}
                  />
                </div>
                {field.state.meta.isTouched && !field.state.meta.isValid ? (
                  <div className="flex w-full items-center gap-x-1">
                    <div className="text-loops-wrong size-4 shrink-0 grow-0">
                      <DangerIcon />
                    </div>
                    <p className="text-loops-wrong font-outfit text-sm leading-5">
                      {field.state.meta.errors.join(", ")}
                    </p>
                  </div>
                ) : null}
              </div>
            )
          }}
        </form.Field>

        <form.Field name="password">
          {(field) => {
            return (
              <div className="flex w-full flex-col items-start gap-y-1">
                <label
                  className="font-outfit text-loops-white text-sm leading-5 font-normal"
                  htmlFor={field.name}
                >
                  Password
                </label>
                <PasswordInput
                  className="bg-loops-card"
                  id={field.name}
                  leftIcon={<LockIcon />}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter your password"
                  value={field.state.value}
                />
                <div className="flex w-full flex-col items-center gap-y-1">
                  {field.state.meta.isTouched && !field.state.meta.isValid ? (
                    <div className="flex w-full items-center gap-x-1">
                      <div className="text-loops-wrong size-4 shrink-0 grow-0">
                        <DangerIcon />
                      </div>
                      <p className="text-loops-wrong font-outfit text-sm leading-5">
                        {field.state.meta.errors.join(", ")}
                      </p>
                    </div>
                  ) : null}
                  <div className="flex w-full justify-end">
                    <Link
                      className="text-loops-cyan font-outfit text-sm leading-6 font-medium tracking-tight"
                      to="/reset-password"
                    >
                      Forget Password?
                    </Link>
                  </div>
                </div>
              </div>
            )
          }}
        </form.Field>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? (
              <svg
                className="h-6 w-6 animate-spin text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Log In"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
