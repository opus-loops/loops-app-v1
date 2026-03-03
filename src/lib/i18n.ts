import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import ar from "../locales/ar.json"
import en from "../locales/en.json"
import fr from "../locales/fr.json"

// Define the resources
const resources = {
  ar: {
    translation: ar,
  },
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
}

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: {
      caches: ["cookie"],
      order: ["cookie", "navigator"],
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
    supportedLngs: ["en", "fr", "ar"],
  })

export default i18n
