import type { ReactNode } from "react"

type PreferencesGroupProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

export function PreferencesGroup({ title, subtitle, children }: PreferencesGroupProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="text-loops-light text-sm font-semibold tracking-wide">
          {title}
        </h3>
        {subtitle ? (
          <p className="text-loops-light/70 text-xs leading-5">{subtitle}</p>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}
