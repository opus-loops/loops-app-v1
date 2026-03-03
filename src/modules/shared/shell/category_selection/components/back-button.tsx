import { ChevronLeft } from "lucide-react"

type BackButtonProps = {
  onBack: () => void
}

export function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f4b6682] opacity-50 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-[#1f4b66aa]"
      onClick={onBack}
    >
      <div className="bg-loops-cyan flex h-5 w-5 items-center justify-center rounded-full">
        <ChevronLeft className="text-loops-light h-4 w-4" />
      </div>
    </button>
  )
}
