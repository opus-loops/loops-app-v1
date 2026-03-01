import type { ReactNode } from "react"

type PreferenceFieldProps = {
  label: string
  htmlFor: string
  icon?: ReactNode
  children: ReactNode
  error?: string | null
  variant?: "surface" | "plain"
}

export function PreferenceField({
  label,
  htmlFor,
  icon,
  children,
  error,
  variant = "surface",
}: PreferenceFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-loops-light text-sm font-medium">
        {label}
      </label>

      {variant === "surface" ? (
        <div className="focus-within:ring-loops-cyan/30 flex min-h-14 w-full items-center gap-3 rounded-2xl border border-transparent bg-loops-light px-4 shadow-sm backdrop-blur-md ring-offset-transparent focus-within:ring-2">
          {icon ? (
            <span className="text-loops-cyan flex h-5 w-5 items-center justify-center">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      ) : (
        <div className="min-w-0">{children}</div>
      )}

      {error ? (
        <p className="text-destructive text-[0.8rem] font-medium">{error}</p>
      ) : null}
    </div>
  )
}
