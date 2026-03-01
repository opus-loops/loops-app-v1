export function ContentSkeleton() {
  return (
    <div className="font-outfit text-loops-light w-full max-w-sm animate-pulse space-y-4 text-base leading-relaxed">
      {/* Title skeleton */}
      <div className="bg-loops-light/20 h-6 w-3/4 rounded-md"></div>

      {/* Paragraph skeletons */}
      <div className="space-y-3">
        <div className="bg-loops-light/15 h-4 w-full rounded"></div>
        <div className="bg-loops-light/15 h-4 w-5/6 rounded"></div>
        <div className="bg-loops-light/15 h-4 w-4/5 rounded"></div>
      </div>

      {/* Another paragraph */}
      <div className="space-y-3 pt-2">
        <div className="bg-loops-light/15 h-4 w-full rounded"></div>
        <div className="bg-loops-light/15 h-4 w-3/4 rounded"></div>
      </div>

      {/* Code block skeleton */}
      <div className="bg-loops-light/10 space-y-2 rounded-lg p-4">
        <div className="bg-loops-light/20 h-3 w-1/4 rounded"></div>
        <div className="bg-loops-light/15 h-3 w-3/4 rounded"></div>
        <div className="bg-loops-light/15 h-3 w-1/2 rounded"></div>
      </div>

      {/* More content */}
      <div className="space-y-3 pt-2">
        <div className="bg-loops-light/15 h-4 w-full rounded"></div>
        <div className="bg-loops-light/15 h-4 w-2/3 rounded"></div>
      </div>
    </div>
  )
}
