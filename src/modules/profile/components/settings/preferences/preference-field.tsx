import type { ReactNode } from "react"

type PreferenceFieldProps = {
  children: ReactNode
  error?: null | string
  htmlFor: string
  icon?: ReactNode
  label: string
  variant?: "plain" | "surface"
}

export function PreferenceField({
  children,
  error,
  htmlFor,
  icon,
  label,
  variant = "surface",
}: PreferenceFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-loops-light text-sm font-medium" htmlFor={htmlFor}>
        {label}
      </label>

      {variant === "surface" ? (
        <div className="focus-within:ring-loops-cyan/30 bg-loops-light flex min-h-14 w-full items-center gap-3 rounded-2xl border border-transparent px-4 shadow-sm ring-offset-transparent backdrop-blur-md focus-within:ring-2">
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
