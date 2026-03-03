import { Link } from "@tanstack/react-router"

import { cn } from "@/modules/shared/lib/utils"

type OpenCategoriesButtonProps = {
  ariaLabel?: string
  className?: string
  search?: Record<string, unknown>
  to: string
}

export function OpenCategoriesButton({
  ariaLabel,
  className,
  search,
  to,
}: OpenCategoriesButtonProps) {
  return (
    <Link
      aria-label={ariaLabel ?? "Open categories"}
      className={cn(
        "bg-loops-cyan/20 hover:bg-loops-cyan/30 flex h-10 w-10 shrink-0 grow-0 items-center justify-center rounded-lg transition-colors",
        className,
      )}
      search={search as any}
      to={to as any}
    >
      <div className="size-6 shrink-0 grow-0 text-[#31BCE6]">
        <svg
          className="size-full"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22 8.52V3.98C22 2.57 21.36 2 19.77 2H15.73C14.14 2 13.5 2.57 13.5 3.98V8.51C13.5 9.93 14.14 10.49 15.73 10.49H19.77C21.36 10.5 22 9.93 22 8.52Z"
            opacity={0.4}
          />
          <path d="M22 19.77V15.73C22 14.14 21.36 13.5 19.77 13.5H15.73C14.14 13.5 13.5 14.14 13.5 15.73V19.77C13.5 21.36 14.14 22 15.73 22H19.77C21.36 22 22 21.36 22 19.77Z" />
          <path d="M10.5 8.52V3.98C10.5 2.57 9.86 2 8.27 2H4.23C2.64 2 2 2.57 2 3.98V8.51C2 9.93 2.64 10.49 4.23 10.49H8.27C9.86 10.5 10.5 9.93 10.5 8.52Z" />
          <path
            d="M10.5 19.77V15.73C10.5 14.14 9.86 13.5 8.27 13.5H4.23C2.64 13.5 2 14.14 2 15.73V19.77C2 21.36 2.64 22 4.23 22H8.27C9.86 22 10.5 21.36 10.5 19.77Z"
            opacity={0.4}
          />
        </svg>
      </div>
    </Link>
  )
}
