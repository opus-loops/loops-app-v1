import { useLogin } from "@/modules/authentication/features/login/services/use-login"
import { DangerIcon } from "@/modules/shared/components/icons/danger"
import { EyeIcon } from "@/modules/shared/components/icons/eye"
import { EyeSlashIcon } from "@/modules/shared/components/icons/eye-slash"
import { LockIcon } from "@/modules/shared/components/icons/lock"
import { UserIcon } from "@/modules/shared/components/icons/user"
import { Button } from "@/modules/shared/components/ui/button"
import { Input } from "@/modules/shared/components/ui/input"
import { useForm } from "@tanstack/react-form"
import { Link } from "@tanstack/react-router"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"

export function LoginForm() {
  const { handleLogin } = useLogin()
  const [passwordVisible, setPasswordVisible] = useState(false)

  const form = useForm({
    defaultValues: { password: "", username: "" },
    onSubmit: async ({ value }) => {
      // TODO: handle api response
      const response = await handleLogin(value.username, value.password)
      if (response._tag === "Failure") {
        console.log(response)
      }
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
                <div className="bg-loops-card flex w-full items-center gap-x-2 rounded-sm px-5 py-4">
                  <div className="text-loops-cyan size-6 shrink-0 grow-0">
                    <LockIcon />
                  </div>
                  <Input
                    className="font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Enter your password"
                    type={passwordVisible ? "text" : "password"}
                    value={field.state.value}
                  />
                  <button
                    className="text-loops-cyan size-6 shrink-0 grow-0"
                    onClick={() => setPasswordVisible((prev) => !prev)}
                    type="button"
                  >
                    <AnimatePresence initial={false} mode="wait">
                      {passwordVisible ? (
                        <motion.div
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0.5 }}
                          initial={{ opacity: 0.5 }}
                          key="eye"
                          transition={{ duration: 0.05 }}
                        >
                          <EyeIcon />
                        </motion.div>
                      ) : (
                        <motion.div
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0.5 }}
                          initial={{ opacity: 0.5 }}
                          key="eye-slash"
                          transition={{ duration: 0.05 }}
                        >
                          <EyeSlashIcon />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
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
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
            disabled={!canSubmit}
            type="submit"
          >
            {isSubmitting ? "Submitting..." : "Log In"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
