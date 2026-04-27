import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

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
          className={cn(
            "font-outfit placeholder:font-outfit placeholder:text-loops-light/90 text-loops-light border-none bg-transparent font-semibold shadow-none focus:outline-none focus-visible:ring-0",
            inputClassName,
          )}
          ref={ref}
          type={isVisible ? "text" : "password"}
          {...props}
        />
        <button
          className="text-loops-cyan size-6 shrink-0 grow-0 focus:outline-none"
          onClick={() => setIsVisible(!isVisible)}
          type="button"
        >
          <AnimatePresence initial={false} mode="wait">
            {isVisible ? (
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
    )
  },
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
