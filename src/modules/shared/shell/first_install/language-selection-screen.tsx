import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { Button } from "@/modules/shared/components/ui/button"
import { OptionCard } from "../onboarding/components/option-card"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

export const PENDING_LANGUAGE_KEY = "loopsSelectedLanguage"

type LanguageId = "en" | "fr" | "ar"

const supportedLanguages: Array<{
  id: LanguageId
  name: string
  code: string
  variant: "medium" | "serious" | "hard"
}> = [
  { id: "en", name: "English", code: "EN", variant: "medium" },
  { id: "fr", name: "Français", code: "FR", variant: "serious" },
  { id: "ar", name: "العربية", code: "AR", variant: "hard" },
]

export function LanguageSelectionScreen({
  onComplete,
}: {
  onComplete: () => void
}) {
  const { t, i18n } = useTranslation()
  const defaultLanguage = useMemo(() => {
    const current = i18n.resolvedLanguage ?? i18n.language
    if (current === "en" || current === "fr" || current === "ar") return current
    return "en"
  }, [i18n.language, i18n.resolvedLanguage])

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageId>(defaultLanguage)

  const handleContinue = useCallback(async () => {
    if (typeof window === "undefined" || typeof window.localStorage === "undefined")
      return

    localStorage.setItem(PENDING_LANGUAGE_KEY, selectedLanguage)
    onComplete()
  }, [selectedLanguage, onComplete])

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
                  <div className="bg-loops-light/20 flex size-9 items-center justify-center rounded-full font-outfit text-sm font-semibold">
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
            onClick={handleContinue}
            type="button"
          >
            {t("common.next")}
          </Button>
        </div>
      </div>
    </SpaceBackground>
  )
}

