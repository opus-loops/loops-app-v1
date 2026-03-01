import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EyeIcon } from "@/modules/shared/components/icons/eye"
import { EyeSlashIcon } from "@/modules/shared/components/icons/eye-slash"
import { Input } from "@/modules/shared/components/ui/input"
import { cn } from "@/modules/shared/lib/utils"

interface PasswordInputProps extends React.ComponentProps<"input"> {
  inputClassName?: string
  leftIcon?: React.ReactNode
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, inputClassName, leftIcon, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false)

    return (
      <div
        className={cn(
          "flex w-full items-center gap-x-2 rounded-sm px-5 py-4",
          className,
        )}
      >
        {leftIcon && (
          <div className="text-loops-cyan size-6 shrink-0 grow-0">
            {leftIcon}
          </div>
        )}
        <Input
          type={isVisible ? "text" : "password"}
          className={cn(
            "font-outfit placeholder:font-outfit text-loops-text border-none bg-transparent font-semibold shadow-none focus:outline-none focus-visible:ring-0",
            inputClassName,
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="text-loops-cyan size-6 shrink-0 grow-0 focus:outline-none"
        >
          <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
              <motion.div
                key="eye"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.05 }}
              >
                <EyeIcon />
              </motion.div>
            ) : (
              <motion.div
                key="eye-slash"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.05 }}
              >
                <EyeSlashIcon />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    )
  },
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
