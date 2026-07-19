import { Effect } from "effect"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { Button } from "@/modules/shared/components/ui/button"
import { useToast } from "@/modules/shared/hooks/use-toast"
import { trackBrowserEvent } from "@/modules/shared/telemetry/app-insights-client"

import type { SupportedLanguage } from "./constants"

import { OptionCard } from "../onboarding/components/option-card"
import { getInAppBrowserContext } from "./browser-context"
import { setPendingLanguageFn } from "./services/set-pending-language-fn"

const supportedLanguages: Array<{
  code: string
  id: SupportedLanguage
  name: string
  variant: "hard" | "medium" | "serious"
}> = [
  { code: "EN", id: "en", name: "English", variant: "medium" },
  { code: "FR", id: "fr", name: "Français", variant: "serious" },
  { code: "AR", id: "ar", name: "العربية", variant: "hard" },
]

type LanguageSelectionScreenProps = {
  onComplete: () => void
}

export function LanguageSelectionScreen({
  onComplete,
}: LanguageSelectionScreenProps) {
  const { i18n, t } = useTranslation()
  const { error: showError } = useToast()

  const defaultLanguage = useMemo(() => {
    const current = i18n.resolvedLanguage ?? i18n.language
    if (current === "en" || current === "fr" || current === "ar") return current
    return "en"
  }, [i18n.language, i18n.resolvedLanguage])

  const [selectedLanguage, setSelectedLanguage] =
    useState<SupportedLanguage>(defaultLanguage)
  const [isSaving, setIsSaving] = useState(false)

  const handleContinue = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)

    await Effect.runPromise(
      Effect.match(
        Effect.tryPromise(() =>
          setPendingLanguageFn({
            data: { language: selectedLanguage },
          }),
        ),
        {
          onFailure: () => {
            trackBrowserEvent("first_install.language_write_failed", {
              browser_context: getInAppBrowserContext(),
            })

            showError(t("common.unexpected_error"))
          },
          onSuccess: onComplete,
        },
      ),
    )
    setIsSaving(false)
  }, [isSaving, onComplete, selectedLanguage, showError, t])

  return (
    <SpaceBackground>
      <div className="flex min-h-screen flex-col px-8 py-6">
        <div className="flex flex-1 flex-col justify-center">
          <div className="mb-8 text-center">
            <h2 className="font-outfit text-loops-light mb-2 text-2xl font-semibold">
              {t("first_install.language.title")}
            </h2>
            <p className="font-outfit mx-auto max-w-sm text-lg leading-6 text-gray-300">
              {t("first_install.language.description")}
            </p>
          </div>

          <div className="mb-8 space-y-3">
            {supportedLanguages.map((language) => (
              <OptionCard
                icon={
                  <div className="bg-loops-light/20 font-outfit flex size-9 items-center justify-center rounded-full text-sm font-semibold">
                    {language.code}
                  </div>
                }
                isSelected={selectedLanguage === language.id}
                key={language.id}
                onClick={() => {
                  setSelectedLanguage(language.id)
                  i18n.changeLanguage(language.id)
                }}
                subtitle={language.code}
                title={language.name}
                variant={language.variant}
              />
            ))}
          </div>

          <Button
            className="font-outfit text-loops-light hover:bg-loops-info bg-loops-cyan w-full rounded-xl py-7 text-lg leading-5 font-semibold capitalize shadow-none"
            disabled={isSaving}
            onClick={handleContinue}
            type="button"
          >
            {t(isSaving ? "common.saving" : "common.next")}
          </Button>
        </div>
      </div>
    </SpaceBackground>
  )
}
