import { Link, useLocation } from "@tanstack/react-router"

import { cn } from "../../lib/utils"
import type { ReactNode } from "react"

interface TabItemProps {
  href: string
  icon: ReactNode
  label: string
}

export function TabItem({ href, icon, label }: TabItemProps) {
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <div className="relative flex flex-col items-center">
      {isActive && (
        <div className="flex flex-col items-center">
          <div className="bg-loops-cyan absolute top-5 h-6 w-6 rounded-full blur-[13px]" />
          <div className="bg-loops-cyan h-1.5 w-14 rounded-b-md" />
        </div>
      )}

      {/* Tab content */}
      <Link
        className={cn(
          "flex flex-col items-center gap-y-1 transition-colors duration-200",
          isActive ? "mt-1.5" : "mt-3",
        )}
        to={href}
      >
        <div
          className={cn(
            "h-10 w-10 transition-colors duration-200",
            isActive ? "text-loops-cyan" : "text-loops-light",
          )}
        >
          {icon}
        </div>

        <span
          className={cn(
            "font-outfit text-center text-[10px] transition-colors duration-200",
            isActive ? "text-loops-cyan font-medium" : "text-loops-light",
          )}
        >
          {label}
        </span>
      </Link>
    </div>
  )
}
