import { useOnboardingStepper } from "../onboarding-stepper"

export function ProgressBar() {
  const { getStepProgress } = useOnboardingStepper()
  const progress = getStepProgress()

  return (
    <div className="bg-opacity-20 bg-loops-light h-1 flex-1 rounded-full">
      <div
        className="bg-loops-cyan h-1 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
