import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

export const resources = {
  en: { translation: en },
} as const;

// Chain via the instance; a bare `use` import trips the rules-of-hooks lint.
// eslint-disable-next-line import/no-named-as-default-member
void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };
