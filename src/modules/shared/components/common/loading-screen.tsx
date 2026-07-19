export function LoadingScreen() {
  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      className="bg-loops-background flex min-h-screen w-full flex-col items-center justify-center gap-7"
      role="status"
    >
      <img
        alt="Loops"
        className="h-auto w-40 max-w-[60vw]"
        height={92}
        src="/svg/loops-orange.svg"
        width={160}
      />
      <span
        aria-hidden="true"
        className="border-loops-cyan/25 border-t-loops-cyan size-9 animate-spin rounded-full border-4"
      />
    </div>
  )
}
