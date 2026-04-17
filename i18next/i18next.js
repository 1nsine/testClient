import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import kk from "./locales/kk";
import ru from "./locales/ru";
import en from "./locales/en";

const silentLogger = {
  log: () => {},
  warn: () => {},
  error: () => {},
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru,
      en,
      kk,
    },

    fallbackLng: "ru",
    supportedLngs: ["ru", "en", "kk"],
    load: "languageOnly",
    cleanCode: true,

    debug: false,
    logger: silentLogger,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
