import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

import { SpaceBackground } from "@/modules/shared/components/common/space-background"
import { Button } from "@/modules/shared/components/ui/button"

import { OptionCard } from "../onboarding/components/option-card"
import { PENDING_LANGUAGE_KEY } from "./constants"
import { setPendingLanguageFn } from "./services/set-pending-language-fn"

export { PENDING_LANGUAGE_KEY }

type LanguageId = "ar" | "en" | "fr"

const supportedLanguages: Array<{
  code: string
  id: LanguageId
  name: string
  variant: "hard" | "medium" | "serious"
}> = [
  { code: "EN", id: "en", name: "English", variant: "medium" },
  { code: "FR", id: "fr", name: "Français", variant: "serious" },
  { code: "AR", id: "ar", name: "العربية", variant: "hard" },
]

export function LanguageSelectionScreen({
  onComplete,
}: {
  onComplete: () => void
}) {
  const { i18n, t } = useTranslation()

  const defaultLanguage = useMemo(() => {
    const current = i18n.resolvedLanguage ?? i18n.language
    if (current === "en" || current === "fr" || current === "ar") return current
    return "en"
  }, [i18n.language, i18n.resolvedLanguage])

  const [selectedLanguage, setSelectedLanguage] =
    useState<LanguageId>(defaultLanguage)

  const handleContinue = useCallback(async () => {
    await setPendingLanguageFn({ data: { language: selectedLanguage } })
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
