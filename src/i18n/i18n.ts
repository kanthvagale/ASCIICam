import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { DEFAULT_LANGUAGE, isSupportedLanguage, type Language } from "./config";
import ar from "./locales/ar.json";
import en from "./locales/en.json";

export const resources = {
  en: { translation: en },
  ar: { translation: ar },
} as const;

/** Best guess before AsyncStorage has been read — the device's own preference. */
export function getDeviceLanguage(): Language {
  const code = Localization.getLocales()[0]?.languageCode;
  return isSupportedLanguage(code) ? code : DEFAULT_LANGUAGE;
}

// i18next's plugin chaining is instance-based; importing the named `use` export
// instead would collide with React's `use` hook under the rules-of-hooks lint.
// eslint-disable-next-line import/no-named-as-default-member
i18n.use(initReactI18next).init({
  resources,
  lng: getDeviceLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "translation",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export { i18n };
