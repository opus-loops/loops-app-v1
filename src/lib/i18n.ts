import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import ar from "../locales/ar.json"
import en from "../locales/en.json"
import fr from "../locales/fr.json"

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  fr: { translation: fr },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      caches: ["cookie"],
      order: ["cookie", "navigator"],
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    resources,
    supportedLngs: ["en", "fr", "ar"],
  })

export default i18n
