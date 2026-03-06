import { useTranslation } from "react-i18next"
import { useOnboardingForm } from "../onboarding-context"
import { Button } from "@/modules/shared/components/ui/button"

export function WelcomeStep() {
  const { t } = useTranslation()
  const form = useOnboardingForm()

  return (
    <div className="flex h-full flex-col px-8 py-6">
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="mb-8 flex flex-col items-center">
          <img
            alt={t("first_install.welcome.slides.3.title")}
            className="aspect[16/9] w-9/12 max-w-md select-none"
            src="/onboarding/3.svg"
          />
        </div>

        <div className="mb-8">
          <h2 className="font-outfit text-loops-light mb-4 text-2xl font-semibold">
            {t("first_install.completion.title")}
          </h2>
          <p className="font-outfit text-lg text-gray-300">
            {t("first_install.completion.description")}
          </p>
        </div>

        <form
          className="w-full"
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <Button
                className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
                disabled={!canSubmit}
                type="submit"
              >
                {isSubmitting ? t("first_install.completion.loading") : t("first_install.completion.button")}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </div>
  )
}
