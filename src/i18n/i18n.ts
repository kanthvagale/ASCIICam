import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";

export const resources = {
  en: { translation: en },
} as const;

// English only for now. Init is synchronous (inline resources), so strings are
// ready before the first render and no provider has to gate on it.
// i18next's plugin chaining is instance-based; importing the named `use` export
// instead would collide with React's `use` hook under the rules-of-hooks lint.
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
