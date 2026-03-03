import React from "react"
import { useTranslation } from "react-i18next"

import { cn } from "@/modules/shared/lib/utils"

interface VerifyButtonProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
}

export const VerifyButton: React.FC<VerifyButtonProps> = ({
  children,
  className,
  disabled = false,
  loading = false,
  onClick,
}) => {
  const { t } = useTranslation()
  const content = children || t("common.verify")

  return (
    <button
      className={cn(
        "h-14 w-full max-w-sm px-6",
        "bg-loops-cyan hover:bg-loops-cyan/90",
        "font-outfit text-loops-light text-lg font-semibold",
        "rounded-xl border-0",
        "transition-all duration-200 ease-in-out",
        "focus:ring-loops-cyan focus:ring-offset-loops-background focus:ring-2 focus:ring-offset-2 focus:outline-none",
        "active:scale-[0.98]",
        "disabled:hover:bg-loops-cyan disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
        className,
      )}
      disabled={disabled || loading}
      onClick={onClick}
      type="button"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{t("common.verifying")}</span>
        </div>
      ) : (
        content
      )}
    </button>
  )
}

VerifyButton.displayName = "VerifyButton"
